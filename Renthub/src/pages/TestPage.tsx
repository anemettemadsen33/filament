import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/api'
import { CheckCircle, XCircle, Info } from '@phosphor-icons/react'

interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'pending'
  message?: string
  details?: any
}

export function TestPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result])
  }

  const runAllTests = async () => {
    setResults([])
    setIsRunning(true)

    try {
      // Test 1: API Health Check
      await testApiHealth()

      // Test 2: Properties Endpoint
      await testProperties()

      // Test 3: Settings Endpoint
      await testSettings()

    } catch (error: any) {
      addResult({
        name: 'Test Suite',
        status: 'fail',
        message: error.message,
      })
    } finally {
      setIsRunning(false)
    }
  }

  const testApiHealth = async () => {
    try {
      const response = await apiClient.get('/ping')
      addResult({
        name: 'API Health Check',
        status: 'pass',
        message: 'API is responding',
        details: response.data,
      })
    } catch (error: any) {
      addResult({
        name: 'API Health Check',
        status: 'fail',
        message: error.message,
      })
    }
  }

  const testProperties = async () => {
    try {
      const response = await apiClient.get('/properties')
      const count = response.data?.data?.length || 0
      addResult({
        name: 'Properties Endpoint',
        status: 'pass',
        message: `Found ${count} properties`,
        details: { count },
      })
    } catch (error: any) {
      addResult({
        name: 'Properties Endpoint',
        status: 'fail',
        message: error.message,
      })
    }
  }

  const testSettings = async () => {
    try {
      const response = await apiClient.get('/settings')
      addResult({
        name: 'Settings Endpoint',
        status: 'pass',
        message: 'Settings retrieved successfully',
        details: response.data,
      })
    } catch (error: any) {
      addResult({
        name: 'Settings Endpoint',
        status: 'fail',
        message: error.message,
      })
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Integration Test</h1>
          <p className="text-muted-foreground">
            Test the connection between frontend and Laravel backend
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Backend Configuration</CardTitle>
            <CardDescription>Current API endpoint settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">API Base URL:</span>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {import.meta.env.VITE_API_URL || 'http://localhost:8000'}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">API Endpoint:</span>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            size="lg"
            className="w-full"
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            {results.map((result, index) => (
              <Card
                key={index}
                className={`border-l-4 ${
                  result.status === 'pass'
                    ? 'border-l-green-500'
                    : result.status === 'fail'
                    ? 'border-l-red-500'
                    : 'border-l-yellow-500'
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{result.name}</CardTitle>
                    <Badge
                      variant={
                        result.status === 'pass'
                          ? 'default'
                          : result.status === 'fail'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {result.status === 'pass' && (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      )}
                      {result.status === 'fail' && (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      {result.status === 'pending' && (
                        <Info className="w-4 h-4 mr-1" />
                      )}
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                  {result.message && (
                    <CardDescription>{result.message}</CardDescription>
                  )}
                </CardHeader>
                {result.details && (
                  <CardContent>
                    <details className="cursor-pointer">
                      <summary className="text-sm text-muted-foreground font-medium mb-2">
                        Show Details
                      </summary>
                      <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {results.length === 0 && !isRunning && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Click "Run All Tests" to start testing the API connection
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
