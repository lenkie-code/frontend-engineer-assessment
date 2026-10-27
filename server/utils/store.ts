import type { LoanApplication, LoanApplicationStatus, LoanPurpose } from '../../types/loan-application'

export type Dataset = 'clean' | 'realistic'
export type SubmitFailure = 'none' | 'server-error' | 'conflict'

export interface MockSettings {
  latencyMs: number
  submitFailure: SubmitFailure
  dataset: Dataset
}

const HOUR = 60 * 60 * 1000
export const EXPIRY_MS = 24 * HOUR

export const settings: MockSettings = {
  latencyMs: 400,
  submitFailure: 'none',
  dataset: 'clean',
}

const applications = new Map<string, LoanApplication>()

export const delay = () => new Promise((resolve) => setTimeout(resolve, settings.latencyMs))

/** Submitted applications become Expired once their expiry time has passed. */
export function withCurrentStatus(application: LoanApplication): LoanApplication {
  if (application.status === 'Submitted' && Date.now() >= Date.parse(application.expiresAt)) {
    return { ...application, status: 'Expired' }
  }
  return application
}

export function listApplications(): LoanApplication[] {
  return [...applications.values()]
    .map(withCurrentStatus)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}

export function getApplication(id: string): LoanApplication | undefined {
  const application = applications.get(id)
  return application && withCurrentStatus(application)
}

export function addApplication(input: Omit<LoanApplication, 'id' | 'status' | 'createdAt' | 'expiresAt'>) {
  const createdAt = new Date()
  const application: LoanApplication = {
    ...input,
    id: crypto.randomUUID(),
    status: 'Submitted',
    createdAt: createdAt.toISOString(),
    expiresAt: new Date(createdAt.getTime() + EXPIRY_MS).toISOString(),
  }
  applications.set(application.id, application)
  return application
}

type Seed = [
  companyName: string,
  companyNumber: string,
  fullName: string,
  email: string,
  amount: number,
  purpose: LoanPurpose,
  status: LoanApplicationStatus,
  createdMsAgo: number,
]

const cleanSeeds: Seed[] = [
  ['Northwind Traders Ltd', '09876543', 'Amara Okafor', 'amara@northwind.co.uk', 75000, 'Working capital', 'Submitted', 2 * HOUR],
  ['Bluebell Bakery Ltd', '11223344', 'Tom Hughes', 'tom@bluebellbakery.co.uk', 25000, 'Equipment purchase', 'InReview', 20 * HOUR],
  ['Harbour Logistics Ltd', 'SC654321', 'Fiona MacLeod', 'fiona@harbourlogistics.com', 150000, 'Business expansion', 'Approved', 3 * 24 * HOUR],
  ['Greenleaf Gardens Ltd', '07654321', 'Priya Shah', 'priya@greenleaf.co.uk', 40000, 'Stock purchase', 'Declined', 5 * 24 * HOUR],
  ['Copperfield Print Ltd', '05432198', 'James Carter', 'james@copperfieldprint.co.uk', 60000, 'Refinancing', 'Expired', 2 * 24 * HOUR],
  ['Oakridge Joinery Ltd', '10293847', 'Sophie Turner', 'sophie@oakridgejoinery.co.uk', 18500, 'Equipment purchase', 'Submitted', 30 * 60 * 1000],
]

// Deliberately awkward data: long and unicode names, huge and fiddly amounts,
// applications on the edge of expiry, and enough rows to stress a layout.
const realisticSeeds: Seed[] = [
  ['The Very Long Company Name Holdings International Group (UK) Limited t/a Northern Industrial Supplies', '08123456', 'Maximilian Alexander Featherstonehaugh-Montgomery', 'maximilian.featherstonehaugh-montgomery@verylongcompanynameholdings.co.uk', 9875432.1, 'Business expansion', 'Submitted', 23 * HOUR + 58 * 60 * 1000 + 30 * 1000],
  ['Zoë’s Café & Bistro Ltd', '10987654', 'Zoë Ng', 'zoe@zoescafe.co.uk', 1000, 'Working capital', 'Submitted', 23 * HOUR + 50 * 60 * 1000],
  ['O’Connor & Sons (Plumbing & Heating) Ltd', 'NI612345', 'Seán O’Connor', 'sean@oconnorandsons.ie', 12345.67, 'Equipment purchase', 'Submitted', 24 * HOUR + 60 * 1000],
  ['ACME SUPPLIES LTD', '00000001', 'JOHN SMITH', 'JOHN.SMITH@ACME-SUPPLIES.CO.UK', 30000, 'Stock purchase', 'Submitted', 4 * 60 * 1000],
  ['Łódź Imports UK Ltd', '13579246', 'Małgorzata Wiśniewska', 'm.wisniewska@lodzimports.co.uk', 250000.5, 'Refinancing', 'InReview', 6 * HOUR],
  ['Ab Ltd', '24681357', 'Al', 'a@b.io', 5000000, 'Other', 'Approved', 10 * 24 * HOUR],
  ['Smith-Jones-Williams-Brown-Taylor-Davies-Evans-Thomas-Roberts Partnership Ltd', 'SC000123', 'Elizabeth Smith-Jones', 'liz@sjwbtdetr.co.uk', 999999.99, 'Business expansion', 'Declined', 7 * 24 * HOUR],
]

const fillerCompanies = ['Riverside', 'Kingfisher', 'Summit', 'Meadow', 'Ironbridge', 'Lantern', 'Foxglove', 'Saltmarsh', 'Beacon', 'Thistle']
const fillerSuffixes = ['Engineering Ltd', 'Catering Services Ltd', 'Building Contractors Ltd', 'Digital Ltd', 'Wholesale Ltd']
const fillerPeople = ['Hannah Lee', 'Oliver Brown', 'Aisha Khan', 'Liam Walsh', 'Chloe Martin', 'Kwame Mensah']
const fillerStatuses: LoanApplicationStatus[] = ['Submitted', 'InReview', 'Approved', 'Declined', 'Expired']
const fillerAmounts = [7500, 32000.25, 48750, 120000, 315000, 2250.4, 87650.1]

function realisticFiller(): Seed[] {
  return Array.from({ length: 29 }, (_, i) => {
    const company = `${fillerCompanies[i % fillerCompanies.length]} ${fillerSuffixes[(i + Math.floor(i / 10)) % fillerSuffixes.length]}`
    const person = fillerPeople[i % fillerPeople.length]
    const status = fillerStatuses[i % fillerStatuses.length]
    const hoursAgo = status === 'Submitted' ? (i % 20) + 1 : 30 + i * 9
    return [
      company,
      String(20000000 + i * 1371),
      person,
      `${person.split(' ')[0].toLowerCase()}@${company.split(' ')[0].toLowerCase()}.co.uk`,
      fillerAmounts[i % fillerAmounts.length],
      'Working capital',
      status,
      hoursAgo * HOUR,
    ]
  })
}

export function seed(dataset: Dataset) {
  applications.clear()
  const seeds = dataset === 'clean' ? cleanSeeds : [...realisticSeeds, ...realisticFiller()]
  const now = Date.now()

  for (const [companyName, companyNumber, fullName, email, amount, purpose, status, createdMsAgo] of seeds) {
    const createdAt = now - createdMsAgo
    const application: LoanApplication = {
      id: crypto.randomUUID(),
      companyName,
      companyNumber,
      fullName,
      email,
      amount,
      purpose,
      status,
      createdAt: new Date(createdAt).toISOString(),
      expiresAt: new Date(createdAt + EXPIRY_MS).toISOString(),
    }
    applications.set(application.id, application)
  }
}

seed(settings.dataset)
