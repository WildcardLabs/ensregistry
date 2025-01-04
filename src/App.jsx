import { useState, useEffect } from 'react'
import { fetchSubgraphData } from './fetchGraph'
import { ExternalLink, Copy } from 'lucide-react'

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
      className="ml-2 p-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors duration-200 flex items-center"
    >
      <Copy size={12} className="mr-1" />
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function Card({ name, owner, transactionHash, blockNumber }) {
  const ensProfileUrl = `https://app.ens.domains/${name}`
  const etherscanUrl = `https://etherscan.io/tx/${transactionHash}`

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-600">
      <h2 className="text-2xl font-bold mb-4 truncate text-emerald-600 dark:text-emerald-400">
        <a
          href={ensProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors duration-200 flex items-center"
        >
          <span className="truncate">{name}</span>
          <ExternalLink size={16} className="ml-2 flex-shrink-0" />
        </a>
      </h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Owner</p>
          <div className="flex items-center">
            <p className="text-gray-800 dark:text-gray-200 font-mono text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded-md flex-grow truncate">{owner}</p>
            <CopyButton text={owner} />
          </div>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Transaction Hash</p>
          <div className="flex items-center">
            <p className="text-gray-800 dark:text-gray-200 font-mono text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded-md flex-grow truncate">{transactionHash}</p>
            <CopyButton text={transactionHash} />
            <a
              href={etherscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 p-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 flex items-center"
            >
              <ExternalLink size={12} className="mr-1" />
              Etherscan
            </a>
          </div>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Block Number</p>
          <div className="flex items-center">
            <p className="text-gray-800 dark:text-gray-200 font-mono text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded-md flex-grow">{blockNumber}</p>
            <CopyButton text={blockNumber.toString()} />
          </div>
        </div>
      </div>
    </div>
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
          name: item.name + ".eth"
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-emerald-900 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-t-4 border-emerald-500 border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-2xl text-emerald-600 dark:text-emerald-400 animate-pulse">Loading ENS data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-emerald-900 flex items-center justify-center p-4">
        <div className="bg-red-100 dark:bg-red-900 border-2 border-red-400 dark:border-red-600 rounded-lg p-6 max-w-md">
          <p className="text-xl text-red-600 dark:text-red-400 text-center">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-emerald-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
              ENS
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-500 dark:from-teal-300 dark:to-blue-400">
              Registry
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 dark:from-emerald-400 dark:via-teal-300 dark:to-blue-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></div>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Real-time tracking of new ENS domain registrations
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredNames.map((name) =>  <Card key={name.id} {...name} /> )}
        </div>
      </div>
    </div>
  )
}

