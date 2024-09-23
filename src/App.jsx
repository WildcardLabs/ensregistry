import { useState, useEffect } from 'react'
import fetchSubgraphData from './fetchGraph'
import { Copy, ExternalLink } from 'lucide-react'

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
      className="ml-2 p-1.5 text-xs bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-md transition-colors duration-200 flex items-center"
    >
      <Copy size={12} className={`mr-1 ${copied ? 'text-green-400' : 'text-gray-400'}`} />
      <span className={copied ? 'text-green-400' : 'text-gray-400'}>
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  )
}

function Card({ name, owner, transactionHash, blockNumber }) {
  const etherscanUrl = `https://etherscan.io/tx/${transactionHash}`
  const ensProfileUrl = `https://app.ens.domains/${name}`

  return (
    <div className="bg-[#1A1A1A] rounded-xl p-5 border border-[#2A2A2A] hover:border-[#3A3A3A] transition-all duration-300 hover:shadow-lg hover:shadow-[#00D2FF]/10">
      <h2 className="text-xl font-bold mb-4 truncate">
        <a
          href={ensProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00D2FF] hover:text-[#00A0FF] transition-colors duration-200 flex items-center"
        >
          <span className="truncate">{name}</span>
          <ExternalLink size={16} className="ml-2 flex-shrink-0" />
        </a>
      </h2>
      <div className="space-y-4">
        <div>
          <p className="text-[#888] text-xs mb-1">Owner</p>
          <div className="flex items-center">
            <p className="text-[#E0E0E0] font-mono text-sm bg-[#2A2A2A] p-2 rounded-md flex-grow truncate">{owner}</p>
            <CopyButton text={owner} />
          </div>
        </div>
        <div>
          <p className="text-[#888] text-xs mb-1">Transaction Hash</p>
          <div className="flex items-center">
            <p className="text-[#E0E0E0] font-mono text-sm bg-[#2A2A2A] p-2 rounded-md flex-grow truncate">{transactionHash}</p>
            <CopyButton text={transactionHash} />
            <a
              href={etherscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 p-1.5 text-xs bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-md transition-colors duration-200 flex items-center text-[#00D2FF] hover:text-[#00A0FF]"
            >
              <ExternalLink size={12} className="mr-1" />
              Etherscan
            </a>
          </div>
        </div>
        <div>
          <p className="text-[#888] text-xs mb-1">Block Number</p>
          <div className="flex items-center">
            <p className="text-[#E0E0E0] font-mono text-sm bg-[#2A2A2A] p-2 rounded-md flex-grow">{blockNumber}</p>
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

  async function fetchData() {
    try {
      const data = await fetchSubgraphData()
      const names = data.nameRegistereds.map((item) => ({
        ...item,
        name: item.name + ".eth"
      }))
      setRegisteredNames(names)
    } catch (err) {
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-[#00D2FF] rounded-full animate-spin mb-4"></div>
        <p className="text-xl text-[#00D2FF] animate-pulse">Loading ENS data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white flex items-center justify-center">
        <div className="bg-[#ff4040] bg-opacity-10 border border-[#ff4040] rounded-lg p-6 max-w-md">
          <p className="text-xl text-[#ff4040] text-center">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5]">
              ENS Registry
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] rounded-full"></div>
          </h1>
          <p className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto">
            Real-time tracking of new ENS domain registrations
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredNames.map((item) => (
            <Card key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}