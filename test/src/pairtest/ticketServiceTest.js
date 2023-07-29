import assert from 'assert';
import TicketService from '../../../src/pairtest/TicketService.js';
import TicketTypeRequest from '../../../src/pairtest/lib/TicketTypeRequest.js';
import InvalidPurchaseException from '../../../src/pairtest/lib/InvalidPurchaseException.js';

describe('TicketService', function () {
    describe('generating errors', function () {
        it('TicketService throw error: Provided ID not valid', function () {
            let ticketService = new TicketService;
            assert.throws(function () {
                ticketService.purchaseTickets(0, new TicketTypeRequest('INFANT', 2), new TicketTypeRequest('ADULT', 3))
            }, InvalidPurchaseException, /Provided ID not valid/);
        })

        it('TicketService throw error: No valid ticket type', function () {
            let ticketService = new TicketService;
            assert.throws(function () {
                ticketService.purchaseTickets(1, new TicketTypeRequest('SENIOR', 4), new TicketTypeRequest('ADULT', 3))
            }, TypeError, /No valid ticket type/);
        })

        it('TicketService throw error: Adult required for ticket purchase"', function () {
            let ticketService = new TicketService;
            assert.throws(function () {
                ticketService.purchaseTickets(1, new TicketTypeRequest('INFANT', 4), new TicketTypeRequest('CHILD', 3))
            }, InvalidPurchaseException, /Adult required for ticket purchase/);
        })

        it('TicketService throw error: Can\'t purchase more than the maximum amount of tickets"', function () {
            let ticketService = new TicketService;
            assert.throws(function () {
                ticketService.purchaseTickets(1, new TicketTypeRequest('INFANT', 6), new TicketTypeRequest('CHILD', 14), new TicketTypeRequest('ADULT', 7))
            }, InvalidPurchaseException, /Can't purchase more than the maximum amount of tickets/);
        })

        it('TicketService throw error: Can\'t purchase more Infant ticket than Adult one"', function () {
            let ticketService = new TicketService;
            assert.throws(function () {
                ticketService.purchaseTickets(1, new TicketTypeRequest('INFANT', 8), new TicketTypeRequest('CHILD', 13), new TicketTypeRequest('ADULT', 7))
            }, InvalidPurchaseException, /Can't purchase more Infant ticket than Adult one/);
        })

        it('TicketService throw errort: No ticket request', function () {
            let ticketService = new TicketService;
            assert.throws(function () {
                ticketService.purchaseTickets(1)
            }, InvalidPurchaseException, /No Ticket request/);
        })
    })

    describe('TicketService succesfull order', function () {
        it('TicketService should return: Succesfull ticket purchase (20 adult ticket)', function () {
            let ticketService = new TicketService;
            assert.equal(ticketService.purchaseTickets(100, new TicketTypeRequest('ADULT', 20)), 'Succesfull ticket purchase')
        })

        it('TicketService should return: Succesfull ticket purchase (9 infant, 11 adult ticket)', function () {
            let ticketService = new TicketService;
            assert.equal(ticketService.purchaseTickets(100, new TicketTypeRequest('INFANT', 9), new TicketTypeRequest('ADULT', 11)), 'Succesfull ticket purchase')
        })

        it('TicketService should return: Succesfull ticket purchase (2 adult, 18 child ticket)', function () {
            let ticketService = new TicketService;
            assert.equal(ticketService.purchaseTickets(100, new TicketTypeRequest('ADULT', 2), new TicketTypeRequest('CHILD', 18)), 'Succesfull ticket purchase')
        })

        it('TicketService should return: Succesfull ticket purchase (1 infant, 3 adult, 16 child ticket)', function () {
            let ticketService = new TicketService;
            assert.equal(ticketService.purchaseTickets(100, new TicketTypeRequest('INFANT', 1), new TicketTypeRequest('ADULT', 3), new TicketTypeRequest('CHILD', 16)), 'Succesfull ticket purchase')
        })

        it('TicketService should return: Succesfull ticket purchase (1 infant, 2 adult, 1 child ticket)', function () {
            let ticketService = new TicketService;
            assert.equal(ticketService.purchaseTickets(100, new TicketTypeRequest('INFANT', 1), new TicketTypeRequest('ADULT', 2), new TicketTypeRequest('CHILD', 1)), 'Succesfull ticket purchase')
        })
    })



})