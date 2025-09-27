"use client"

import { Button } from "@/components/ui/button"
import { WalletGuard } from "@/components/wallet-guard"
import { useState, useEffect, useCallback, AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Database, User, Tag, Clock } from "lucide-react"



export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Search handler
  const handleSearch = useCallback(async () => {
    if (!query) return // Prevent empty searches

    setSubmitted(true)
    setLoading(true)

    try {
      // First API call
      const res = await fetch(`http://127.0.0.1:3001/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: query }),
      })
      const { tags } = await res.json()

      // Second API call for dataset search
      const tagstring = tags.join(",")
      const res1 = await fetch(`api/agent/${tagstring}`)
      const datasets = await res1.json()

      // Set the results
      // [{ id, tags, description }]
      const transformed = datasets.map(({description,id,owner,tags}:any)=>{
        tags = tags.join(",");
        return {description,id,tags};
      }) 

      console.log(transformed);
      const res2 =await fetch(`http://127.0.0.1:3001/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: query , datasets:transformed}),
      })
      const data2 = await res2.json();
      console.log("Data from second select:", data2.selected);
      const filtered=datasets.filter((ds:any)=>data2.selected.includes(ds.id));
      setResults(filtered)
    } catch (error) {
      console.error("Error fetching datasets:", error)
    } finally {
      setLoading(false)
    }
  }, [query])

  // Remove automatic search on query change - now only manual search
  // useEffect(() => {
  //   if (query) {
  //     handleSearch()
  //   }
  // }, [query, handleSearch])

  return (
    <WalletGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
        {/* Header with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/80 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center px-4">
          {/* Search Section */}
          <div
            className={`w-full max-w-4xl transition-all duration-700 ease-out ${
              submitted ? "pt-12 pb-8" : "pt-32 pb-16 min-h-screen flex flex-col justify-center"
            }`}
          >
            {/* Title - only show when not submitted */}
            {!submitted && (
              <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent mb-4">
                  Dataset Search
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Discover and explore datasets with intelligent semantic search
                </p>
              </div>
            )}

            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative flex gap-3 p-2 bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for datasets..."
                    className="w-full pl-12 pr-4 py-4 bg-transparent border-none text-white placeholder-gray-400 focus:outline-none text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={loading || !query}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {submitted && (
            <div className="w-full max-w-7xl pb-16">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
                    <div className="w-12 h-12 border-4 border-gray-800 border-t-purple-500 rounded-full animate-spin absolute top-2 left-2" />
                  </div>
                  <p className="text-gray-400 mt-6 text-lg">Searching datasets...</p>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Search Results</h2>
                    <p className="text-gray-400">Found {results.length} relevant dataset{results.length !== 1 ? 's' : ''}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((dataset, index) => (
                      <Card 
                        key={dataset.id} 
                        className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardContent className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2 text-blue-400">
                              <Database className="w-4 h-4" />
                              <span className="text-sm font-mono">{dataset.id}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="mb-4">
                            <h3 className="font-semibold text-white text-lg leading-tight mb-2 group-hover:text-blue-300 transition-colors">
                              {dataset.description}
                            </h3>
                          </div>

                          {/* Owner */}
                          <div className="flex items-center gap-2 mb-4 text-gray-400">
                            <User className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm truncate" title={dataset.owner}>
                              {dataset.owner}
                            </span>
                          </div>

                          {/* Tags */}
                          <div className="flex items-start gap-2">
                            <Tag className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex flex-wrap gap-1.5">
                              {dataset.tags.map((tag: string) => (
                                <span 
                                  key={tag.toString()} 
                                  className="text-xs px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full hover:bg-blue-500/30 transition-colors cursor-default"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4 opacity-20">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No datasets found</h3>
                  <p className="text-gray-500">Try adjusting your search terms or using different keywords</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </WalletGuard>
  )
}

function SummaryBar({
  count,
  totalMB,
  totalPrice,
  onBuy,
}: {
  count: number
  totalMB: number
  totalPrice: number
  onBuy: () => void
}) {
  const disabled = count === 0
  return (
    <div className="sticky bottom-4 mt-8">
      <div className="mx-auto max-w-4xl rounded-lg border bg-card px-4 py-3 flex items-center justify-between">
        <div className="text-sm">
          <span className="text-muted-foreground">Selected:</span> <strong>{count}</strong> file(s) •{" "}
          <strong>{totalMB} MB</strong> • <span className="text-[var(--brand)]">{totalPrice.toFixed(6)} ETH</span>
        </div>
        <Button
          disabled={disabled}
          onClick={onBuy}
          className="bg-[var(--brand)] text-[var(--on-brand)] hover:opacity-90"
        >
          Buy Selected
        </Button>
      </div>
    </div>
  )
}