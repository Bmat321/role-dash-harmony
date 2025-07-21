
export interface AppraisalTarget {
  id: string;
  category: 'OBJECTIVES' | 'FINANCIAL' | 'CUSTOMER_SERVICE' | 'INTERNAL_PROCESS' | 'LEARNING_AND_GROWTH';
  name: string;
  marks: number;
  kpi: string;
  measurementTracker: string;
}

export const availableTargets: AppraisalTarget[] = [
  // OBJECTIVES (35 marks total)
  {
    id: 'unit-objective',
    category: 'OBJECTIVES',
    name: 'Unit Objective',
    marks: 20,
    kpi: 'Timely and Accurate fulfilment of all visa and immigration requests as received via email; Track all sales',
    measurementTracker: 'Show evidence on daily report on HRIS, Weekly Visa and Immigration request fulfilment data and sales. MIS tracking report. 1 negative mark per missed/delayed requests due to human error.'
  },
  {
    id: 'mandatory-sales',
    category: 'OBJECTIVES',
    name: 'Mandatory Sales Requirement',
    marks: 15,
    kpi: 'Close sale/contribute an initiative that generates revenue. (Show evidence of total individual sales)',
    measurementTracker: '(Show evidence of total individual sales)'
  },
  
  // FINANCIAL (30 marks total)
  {
    id: 'internal-customer-service',
    category: 'FINANCIAL',
    name: 'Satisfactory service to internal customer',
    marks: 10,
    kpi: 'Early submission of time bound tasks, Availability via SMS, CUG, Whatsapp, 3CX, when required. Immediate acceptable feedback/dissemination of relevant info to all concerned. Satisfactory and Timely responses to internal requests.',
    measurementTracker: 'Daily Minutes of meeting/Weekly Sales Activity/Monthly Accounts Management/Quarterly Board Report report submission. Show screen shots of time stamps and link to weekly reports on concave). Show evidence /concave links to key specific role related activities eg daily age analysis, daily minutes of meetings with clients, quarterly vendor/ supplier visits and evaluation etc'
  },
  {
    id: 'client-complaint-management',
    category: 'FINANCIAL',
    name: 'Must keep the external client complaint volume down for the entire year',
    marks: 10,
    kpi: 'Must keep the external client complaint volume down for the entire year. Manage internal or external issues, generate QA investigation report and follow through till resolved',
    measurementTracker: 'Show QA investigation report of all incidents. Evidence of feedback link for process and corrective trainings, Minimum of 2 internal/external commendations per appraisal period'
  },
  {
    id: 'sla-compliance',
    category: 'FINANCIAL',
    name: 'Followed up via calls, messages, emails etc and responded according to SLA',
    marks: 10,
    kpi: 'Followed up via calls, messages, emails etc and responded according to SLA. Kept to agreed terms, implementation of signed contract and agreed timelines',
    measurementTracker: 'Minimum of 80% customer satisfaction ratings. Show evidence of 100% vendor/supplier visit reports/Audit reports/renewal reports/vendor quarterly evaluation report'
  },
  
  // CUSTOMER SERVICE (20 marks total)
  {
    id: 'sop-adherence',
    category: 'CUSTOMER_SERVICE',
    name: 'Adherence to SOPs, documentation of processes, back up of key positions',
    marks: 5,
    kpi: 'Strict adherence to SOPs/stipulated guidelines on reports, Up to date documentation in line with expectations, Documented leave reliever training and demonstrated ability to take ownership of tasks and persons assigned',
    measurementTracker: 'Show evidence of SOPs on flow charts, Identify CHOICE and Mission Statement. Show minimum of three self driven initiatives within appraisal period that demonstrated any of our CHOICE core values. Addition for team leads, show documented evidence of leave relievers. also show minimum of 3 self driven initiatives within the appraisal period that demonstrates profitability, professionalism, customer oriented service, innovative process, adoption of technology or best in ethics and efficiency (GHI Core Values)'
  },
  {
    id: 'punctuality',
    category: 'CUSTOMER_SERVICE',
    name: 'Punctuality and availability',
    marks: 5,
    kpi: 'Resumption as stated in departmental calendar/as directed at client\'s office, at internal/external meetings and at training sessions',
    measurementTracker: 'Average of daily attendance score from the Time and Attendance biometric machine, also from the HRIS. Evidence of training feedback form of all scheduled trainings'
  },
  {
    id: 'prime-responsibilities',
    category: 'CUSTOMER_SERVICE',
    name: 'Prime responsibilities and duties',
    marks: 10,
    kpi: 'Prime Responsibilities and Duties (As listed in Job Description)',
    measurementTracker: 'Average of monthly evaluation scores/QA biannual scores attained within appraisal period'
  },
  
  // INTERNAL PROCESS (5 marks total)
  {
    id: 'leadership-evaluation',
    category: 'INTERNAL_PROCESS',
    name: 'Leadership Evaluation and knowledge sharing',
    marks: 5,
    kpi: 'Compliance with BTM Culture tests- Annual Customer service certificate, Quarterly English and Geography tests',
    measurementTracker: 'Show certificates and screen shots of quarterly English test, annual Customer service training, annual Business Ethics training and bi-annual Geography tests'
  },
  
  // LEARNING AND GROWTH (10 marks total)
  {
    id: 'self-driven-training',
    category: 'LEARNING_AND_GROWTH',
    name: 'Individual/Self Driven Role Related Training',
    marks: 10,
    kpi: 'Identify, attend and document self driven role related trainings, webinars and conferences as assigned or listed in the training calendar/Personal Brand Positioning across digital platforms',
    measurementTracker: 'Show evidence of 8 hours of training per appraisal period and 16 hours for the entire year or show links to 8 BTM related brand awareness published work on social media per appraisal period and 16 hours/16 BTM related posts on personal SM handle for the entire year. Alternatively, share evidence of degree completed, professional certification attained or research work published on journal.'
  }
];
