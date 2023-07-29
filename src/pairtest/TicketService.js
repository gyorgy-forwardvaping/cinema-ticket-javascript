import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  /**
   * 
   * @param {Integer} price 
   * @param {Integer} seats 
   * @returns price * seats
   */
  #calculatePrice = (price, seats) => {
    if (!Number.isInteger(price) || !Number.isInteger(seats)) {
      throw new TypeError("Price and seat must be valid number")
    }
    return seats * price;
  }

  /**
   * 
   * @param {Integer} accountId 
   * @param {Integer} totalPrice 
   * @param {Integer} totalSeat 
   * @returns true if the ticketPaymentService and SeatReservationService was succesfull otherwise return error message
   */
  #makeReservation = (accountId, totalPrice, totalSeat) => {
    const ticketPaymentService = new TicketPaymentService,
      seatReservationService = new SeatReservationService

    try {
      ticketPaymentService.makePayment(accountId, totalPrice)
      seatReservationService.reserveSeat(accountId, totalSeat)
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  #onTimeMaximumTickets = 20
  #adultPrice = 20
  #childPrice = 10
  #infantPrice = 0

  /**
   * 
   * @param {Integer} accountId  user account ID
   * @param  {...any} ticketTypeRequests requested ticket type and number by user
   * @returns "Succesfull ticket purchase" if the process was succesfull or throw error if something went wrong
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException

    /**
     * accountId should be Integer and greather than 0
     */
    if (!Number.isInteger(accountId) || accountId == 0) {
      throw new InvalidPurchaseException("Provided ID not valid")
    }

    let tickets = 0, //the total number of ticket what is requested
      seats = 0, // The total number of seats what is requested
      adults = 0, //total adult number
      children = 0, //total child number
      infants = 0, // total infant number
      totalPrice = 0 //total price for the tickets

    /**
     * the ticketTypeRequests can't be empty. If happen, it mean the user didn't sent any ticket request information
     */

    if (ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException('No Ticket request')
    }

    /**
     * gathering information about the requested tickets
     * which type and how many was requested
     * calculating prices
     */
    ticketTypeRequests.forEach(request => {
      if (request.getTicketType() == 'ADULT') {
        adults += request.getNoOfTickets()
        totalPrice += this.#calculatePrice(this.#adultPrice, adults)
      } else if (request.getTicketType() == 'CHILD') {
        children += request.getNoOfTickets()
        totalPrice += this.#calculatePrice(this.#childPrice, children)
      } else if (request.getTicketType() == 'INFANT') {
        infants += request.getNoOfTickets()
        totalPrice += this.#calculatePrice(this.#infantPrice, infants)
      } else {
        throw new InvalidPurchaseException('Wrong ticket type')
      }
    })

    /**
     * double checking empty ticketTypeRequests
     */

    if (adults == 0 && children == 0 && infants == 0) {
      throw new InvalidPurchaseException('No Ticket request')
    }

    /**
     * without adult no ticket can be purchased
     */
    if (adults == 0) {
      throw new InvalidPurchaseException("Adult required for ticket purchase")
    }

    /**
     * because infant don't require seats we count just adult and child tickets
    */
    seats = adults + children

    /**
     * Total number of tickets, even Infant not require seat they need ticket
     */

    tickets = seats + infants

    if (tickets > this.#onTimeMaximumTickets) {
      throw new InvalidPurchaseException("Can't purchase more than the maximum amount of tickets")
    }
    /**
     * infants can sit just on adults lap, according one adult can hold one infant, 
     * the infants number can't be greather than the adults one.
     */
    if (adults < infants) {
      throw new InvalidPurchaseException("Can't purchase more Infant ticket than Adult one")
    }


    /**
     * if we hit this part we can assume the criterias are valid
     */
    if (this.#makeReservation(accountId, totalPrice, seats)) {
      return "Succesfull ticket purchase";
    }
  }
}
