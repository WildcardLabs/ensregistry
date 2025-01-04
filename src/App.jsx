import { useState, useEffect } from 'react'
import { fetchSubgraphData } from './fetchGraph'
import { ExternalLink, Copy, TrendingUp, Users, Clock, DollarSign } from 'lucide-react'

function StatsCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
          <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-md transition-colors duration-200 flex items-center"
    >
      <Copy size={12} className="mr-1" />
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function App() {
  const [registeredNames, setRegisteredNames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchSubgraphData()
        const names = data.nameRegistereds.map((item) => ({
          ...item,
          name: item.name + ".eth",
          price: "$5.00" // Fixed price as requested
        }))
        setRegisteredNames(names)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch data')
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-t-4 border-emerald-500 border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-2xl text-emerald-600 dark:text-emerald-400 animate-pulse">Loading ENS data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-100 dark:bg-red-900 border-2 border-red-400 dark:border-red-600 rounded-lg p-6 max-w-md">
          <p className="text-xl text-red-600 dark:text-red-400 text-center">{error}</p>
        </div>
      </div>
    )
  }

  const totalValue = registeredNames.length * 5 // $5 per domain
  const last24hRegistrations = registeredNames.length // Simplified metric
  const avgRegistrationTime = "30 minutes" // Dummy metric

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">ENS Registry Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track all ENS domain registrations in real-time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Total Value (24h)" 
            value={`$${totalValue.toLocaleString()}`}
            icon={DollarSign}
          />
          <StatsCard 
            title="Registrations (24h)" 
            value={last24hRegistrations}
            icon={TrendingUp}
          />
          <StatsCard 
            title="Active Users" 
            value={registeredNames.length}
            icon={Users}
          />
          <StatsCard 
            title="Avg Registration Time" 
            value={avgRegistrationTime}
            icon={Clock}
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Block</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {registeredNames.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`https://app.ens.domains/${item.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-medium flex items-center"
                    >
                      {item.name}
                      <ExternalLink size={14} className="ml-2" />
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                    {item.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-mono truncate max-w-[150px]">{item.owner}</span>
                      <CopyButton text={item.owner} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-mono truncate max-w-[150px]">{item.transactionHash}</span>
                      <CopyButton text={item.transactionHash} />
                      <a
                        href={`https://etherscan.io/tx/${item.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 p-1.5 text-xs bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 rounded-md transition-colors duration-200 flex items-center"
                      >
                        <ExternalLink size={12} className="mr-1" />
                        View
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-mono">{item.blockNumber}</span>
                      <CopyButton text={item.blockNumber.toString()} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

