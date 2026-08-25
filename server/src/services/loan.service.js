import { prisma } from '../prisma.js';

export class LoanService {
  static async getActiveRates() {
    return prisma.bankRate.findMany({
      where: { isActive: true },
      orderBy: { interestRate: 'asc' }
    });
  }

  static async getAllRates() {
    return prisma.bankRate.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createBankRate(data) {
    return prisma.bankRate.create({
      data: {
        bankKey: data.bankKey.toLowerCase(),
        bankName: data.bankName,
        interestRate: parseFloat(data.interestRate),
        minDownPaymentPercent: parseFloat(data.minDownPaymentPercent || 20),
        maxTenureYears: parseInt(data.maxTenureYears || 30, 10),
        description: data.description || null
      }
    });
  }

  static async updateBankRate(id, data) {
    return prisma.bankRate.update({
      where: { id },
      data: {
        ...(data.bankName ? { bankName: data.bankName } : {}),
        ...(data.interestRate ? { interestRate: parseFloat(data.interestRate) } : {}),
        ...(data.minDownPaymentPercent ? { minDownPaymentPercent: parseFloat(data.minDownPaymentPercent) } : {}),
        ...(data.maxTenureYears ? { maxTenureYears: parseInt(data.maxTenureYears, 10) } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.isActive !== undefined ? { isActive: Boolean(data.isActive) } : {})
      }
    });
  }

  static async calculateLoan({ propertyPriceNu, downPaymentNu, tenureYears, bankKey }) {
    const propertyPrice = parseFloat(propertyPriceNu);
    const downPayment = parseFloat(downPaymentNu || 0);
    const tenure = parseInt(tenureYears || 20, 10);

    const loanAmount = Math.max(0, propertyPrice - downPayment);
    if (loanAmount <= 0) {
      throw new Error('Down payment cannot be equal to or greater than property price.');
    }

    // Query active rate from DB
    let bankRateRecord;
    if (bankKey) {
      bankRateRecord = await prisma.bankRate.findUnique({
        where: { bankKey: bankKey.toLowerCase() }
      });
    }

    if (!bankRateRecord) {
      // Pick first active bank rate
      bankRateRecord = await prisma.bankRate.findFirst({
        where: { isActive: true },
        orderBy: { interestRate: 'asc' }
      });
    }

    if (!bankRateRecord) {
      throw new Error('No active bank loan rates configured in database.');
    }

    const annualRate = bankRateRecord.interestRate;
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = tenure * 12;

    // EMI Formula: [P x R x (1+R)^N] / [(1+R)^N - 1]
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - loanAmount;

    return {
      bank: {
        bankKey: bankRateRecord.bankKey,
        bankName: bankRateRecord.bankName,
        interestRate: bankRateRecord.interestRate
      },
      loanAmountNu: Math.round(loanAmount),
      downPaymentNu: Math.round(downPayment),
      tenureYears: tenure,
      totalMonths,
      monthlyEmiNu: Math.round(emi),
      totalInterestNu: Math.round(totalInterest),
      totalPaymentNu: Math.round(totalPayment)
    };
  }
}
