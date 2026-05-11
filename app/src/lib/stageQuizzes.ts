import type { QuizQuestion } from '@/components/StageQuiz';

export const stageQuizzes: Record<string, QuizQuestion[]> = {
  '01-strategy': [
    {
      question: 'What is the minimum deposit most lenders prefer for a property purchase?',
      options: ['5%', '10%', '20%', '50%'],
      correctIndex: 2,
      explanation: 'While some schemes allow 5%, most lenders prefer 20% to avoid Lenders Mortgage Insurance (LMI).',
    },
    {
      question: 'Which government scheme allows first home buyers to purchase with a 5% deposit without LMI?',
      options: ['First Home Owner Grant', 'First Home Buyer Assistance Scheme', 'First Home Guarantee', 'Family Home Guarantee'],
      correctIndex: 2,
      explanation: 'The First Home Guarantee lets eligible buyers purchase with just 5% deposit, with the government guaranteeing up to 15% to avoid LMI.',
    },
    {
      question: 'Before attending open homes, what should you have organised?',
      options: ['A building inspector', 'Pre-approval', 'A conveyancer', 'Home insurance'],
      correctIndex: 1,
      explanation: 'Pre-approval gives you a realistic budget and shows agents you are a serious buyer.',
    },
  ],
  '02-finance-prep': [
    {
      question: 'What does "genuine savings" typically mean to a lender?',
      options: ['Money saved over 3+ months', 'A gift from family', 'A tax refund', 'Money from selling a car'],
      correctIndex: 0,
      explanation: 'Lenders usually want to see savings built up over at least 3 months in your account.',
    },
    {
      question: 'What is APRA\'s standard serviceability buffer added to interest rates?',
      options: ['1%', '2%', '3%', '5%'],
      correctIndex: 2,
      explanation: 'APRA requires lenders to assess your ability to repay at the current rate plus 3%, or a minimum floor rate (whichever is higher).',
    },
  ],
  '03-market-research': [
    {
      question: 'Which metric best compares rental yield across properties?',
      options: ['Total purchase price', 'Weekly rent ÷ purchase price × 52', 'Median suburb price', 'Council rates'],
      correctIndex: 1,
      explanation: 'Gross rental yield = (annual rent / purchase price) × 100. This lets you compare properties of different prices.',
    },
  ],
  '04-shortlisting': [
    {
      question: 'What is a "cooling off period" in NSW?',
      options: ['Time to inspect the property', 'Time to cancel the contract after exchange', 'Time before auction', 'Time to get finance approved'],
      correctIndex: 1,
      explanation: 'In NSW, buyers typically get 5 business days to cool off after exchanging contracts (with a 0.25% penalty).',
    },
  ],
  '05-inspection-dd': [
    {
      question: 'Which report is essential when buying an apartment?',
      options: ['Building inspection', 'Pest inspection', 'Strata report', 'All of the above'],
      correctIndex: 3,
      explanation: 'For apartments, you need building, pest, AND strata reports to understand the full picture including building finances.',
    },
  ],
  '06-offer-negotiation': [
    {
      question: 'What is typically paid when making an offer?',
      options: ['Full purchase price', '0.25% holding deposit', '10% deposit', 'Stamp duty'],
      correctIndex: 1,
      explanation: 'A holding deposit (often 0.25%) shows good faith while contracts are prepared. The 10% deposit is paid at exchange.',
    },
  ],
  '07-contract-review': [
    {
      question: 'Who should review your contract BEFORE you sign?',
      options: ['Your mortgage broker', 'Your real estate agent', 'A conveyancer or solicitor', 'Your parents'],
      correctIndex: 2,
      explanation: 'Only a conveyancer or solicitor can properly identify legal risks, special conditions, and issues in the contract.',
    },
  ],
  '08-settlement': [
    {
      question: 'What happens on settlement day?',
      options: ['You move in', 'Funds are transferred and title is registered', 'You pay stamp duty', 'You get the keys immediately'],
      correctIndex: 1,
      explanation: 'Settlement is when your lender pays the seller, the title transfers to your name, and the property legally becomes yours.',
    },
  ],
};
