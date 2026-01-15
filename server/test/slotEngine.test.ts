import { expect } from 'chai';
import { spin, transpose, getWinnings, runSpin, countSymbols, getExpectedProbabilities } from '../src/engine/slotEngine';
import { Symbol } from '../src/engine/types';

describe('Slot Engine', () => {
  describe('spin()', () => {
    it('should return 3 reels (columns)', () => {
      const reels = spin();
      expect(reels).to.have.lengthOf(3);
    });

    it('should have 3 symbols per reel', () => {
      const reels = spin();
      reels.forEach(reel => {
        expect(reel).to.have.lengthOf(3);
      });
    });

    it('should only contain valid symbols', () => {
      const reels = spin();
      const validSymbols = ['A', 'B', 'C', 'D'];
      
      reels.forEach(reel => {
        reel.forEach(symbol => {
          expect(validSymbols).to.include(symbol);
        });
      });
    });
  });

  describe('transpose()', () => {
    it('should convert columns to rows correctly', () => {
      const reels: Symbol[][] = [
        ['A', 'B', 'C'],
        ['D', 'A', 'B'],
        ['C', 'D', 'A']
      ];
      
      const rows = transpose(reels);
      
      expect(rows[0]).to.deep.equal(['A', 'D', 'C']);
      expect(rows[1]).to.deep.equal(['B', 'A', 'D']);
      expect(rows[2]).to.deep.equal(['C', 'B', 'A']);
    });

    it('should maintain grid dimensions', () => {
      const reels = spin();
      const rows = transpose(reels);
      
      expect(rows).to.have.lengthOf(3);
      rows.forEach(row => {
        expect(row).to.have.lengthOf(3);
      });
    });
  });

  describe('getWinnings()', () => {
    it('should return 0 for no matches', () => {
      const rows: Symbol[][] = [
        ['A', 'B', 'C'],
        ['D', 'A', 'B'],
        ['C', 'D', 'A']
      ];
      
      const winnings = getWinnings(rows, 10, 3);
      expect(winnings).to.equal(0);
    });

    it('should calculate winnings for matching row', () => {
      const rows: Symbol[][] = [
        ['A', 'A', 'A'], // Matches! A = 5x
        ['D', 'A', 'B'],
        ['C', 'D', 'A']
      ];
      
      const winnings = getWinnings(rows, 10, 1);
      expect(winnings).to.equal(50); // 10 * 5
    });

    it('should only check active lines', () => {
      const rows: Symbol[][] = [
        ['A', 'A', 'A'], // Line 1: matches
        ['B', 'B', 'B'], // Line 2: matches (but not active)
        ['C', 'D', 'A']
      ];
      
      const winnings = getWinnings(rows, 10, 1); // Only 1 line active
      expect(winnings).to.equal(50); // Only first line counts
    });

    it('should sum multiple winning lines', () => {
      const rows: Symbol[][] = [
        ['D', 'D', 'D'], // 10 * 2 = 20
        ['B', 'B', 'B'], // 10 * 4 = 40
        ['C', 'C', 'C']  // 10 * 3 = 30
      ];
      
      const winnings = getWinnings(rows, 10, 3);
      expect(winnings).to.equal(90); // 20 + 40 + 30
    });
  });

  describe('runSpin()', () => {
    it('should return complete SpinResult', () => {
      const result = runSpin({ lines: 3, betPerLine: 10 });
      
      expect(result).to.have.property('reels');
      expect(result).to.have.property('rows');
      expect(result).to.have.property('winnings');
      expect(result).to.have.property('totalBet');
      expect(result).to.have.property('net');
      expect(result).to.have.property('symbolCountsObserved');
    });

    it('should calculate totalBet correctly', () => {
      const result = runSpin({ lines: 2, betPerLine: 5 });
      expect(result.totalBet).to.equal(10);
    });

    it('should calculate net correctly', () => {
      const result = runSpin({ lines: 3, betPerLine: 10 });
      expect(result.net).to.equal(result.winnings - result.totalBet);
    });
  });

  describe('countSymbols()', () => {
    it('should count all symbols correctly', () => {
      const reels: Symbol[][] = [
        ['A', 'B', 'C'],
        ['A', 'B', 'D'],
        ['A', 'C', 'D']
      ];
      
      const counts = countSymbols(reels);
      expect(counts.A).to.equal(3);
      expect(counts.B).to.equal(2);
      expect(counts.C).to.equal(2);
      expect(counts.D).to.equal(2);
    });
  });

  describe('getExpectedProbabilities()', () => {
    it('should return probabilities summing to 1', () => {
      const probs = getExpectedProbabilities();
      const sum = Object.values(probs).reduce((a, b) => a + b, 0);
      expect(sum).to.be.closeTo(1, 0.001);
    });

    it('should calculate correct individual probabilities', () => {
      const probs = getExpectedProbabilities();
      // Total = 2+4+6+8 = 20
      expect(probs.A).to.equal(2/20); // 0.1
      expect(probs.B).to.equal(4/20); // 0.2
      expect(probs.C).to.equal(6/20); // 0.3
      expect(probs.D).to.equal(8/20); // 0.4
    });
  });

  describe('Statistical sanity (over many spins)', () => {
    it('should produce symbol distribution close to expected (10k spins)', function(this: Mocha.Context) {
      this.timeout(5000); // Allow time for 10k spins
      
      const trials = 10000;
      const totalCounts = { A: 0, B: 0, C: 0, D: 0 };
      
      for (let i = 0; i < trials; i++) {
        const reels = spin();
        const counts = countSymbols(reels);
        totalCounts.A += counts.A;
        totalCounts.B += counts.B;
        totalCounts.C += counts.C;
        totalCounts.D += counts.D;
      }
      
      const totalSymbols = trials * 9; // 10k spins × 9 symbols per spin
      const expectedProbs = getExpectedProbabilities();
      
      // Allow 2% margin of error
      Object.keys(expectedProbs).forEach(symbol => {
        const observed = totalCounts[symbol as Symbol] / totalSymbols;
        const expected = expectedProbs[symbol];
        expect(observed).to.be.closeTo(expected, 0.02);
      });
    });
  });
});