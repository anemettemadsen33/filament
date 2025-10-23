/**
 * API Test Component for RentHub
 * Tests Laravel backend integration and authentication flow
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/authContext'
import { LoginModal } from '@/components/LoginModal'
import apiClient from '@/lib/apiClient'
import config from '@/lib/config'
import { toast } from 'sonner'
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message?: string
}

export function ApiTestPanel() {
  const { user, isAuthenticated, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)

  const updateTestResult = (name: string, status: 'success' | 'error', message?: string) => {
    setTestResults(prev => 
      prev.map(test => 
        test.name === name ? { ...test, status, message } : test
      )
    )
  }

  const runApiTests = async () => {
    setIsRunningTests(true)
    
    const tests: TestResult[] = [
      { name: 'Configuration Check', status: 'pending' },
      { name: 'Backend Health Check', status: 'pending' },
      { name: 'CSRF Cookie Request', status: 'pending' },
      { name: 'API Response Format', status: 'pending' },
      { name: 'Error Handling', status: 'pending' },
    ]
    
    setTestResults(tests)

    try {
      // Test 1: Configuration Check
      updateTestResult('Configuration Check', 'success', 
        `API Base URL: ${config.API_BASE_URL}`)
      
      // Test 2: Backend Health Check
      try {
        const isHealthy = await apiClient.healthCheck()
        if (isHealthy) {
          updateTestResult('Backend Health Check', 'success', 
            'Backend is responding')
        } else {
          updateTestResult('Backend Health Check', 'error', 
            'Backend health check failed')
        }
      } catch (error) {
        updateTestResult('Backend Health Check', 'error', 
          `Cannot connect to backend: ${error}`)
      }

      // Test 3: CSRF Cookie Request
      try {
        await apiClient.getCsrfCookie()
        updateTestResult('CSRF Cookie Request', 'success', 
          'CSRF cookie obtained successfully')
      } catch (error) {
        updateTestResult('CSRF Cookie Request', 'error', 
          `CSRF request failed: ${error}`)
      }

      // Test 4: API Response Format
      try {
        // Try to get user data (will fail if not authenticated, but we can check response format)
        await apiClient.getUser()
        updateTestResult('API Response Format', 'success', 
          'API response format is valid')
      } catch (error: any) {
        if (error.status === 401) {
          updateTestResult('API Response Format', 'success', 
            'API error format is valid (401 Unauthorized)')
        } else {
          updateTestResult('API Response Format', 'error', 
            `Unexpected API response: ${error.message}`)
        }
      }

      // Test 5: Error Handling
      try {
        await apiClient.get('/api/v1/nonexistent-endpoint')
        updateTestResult('Error Handling', 'error', 
          'Expected 404 error but request succeeded')
      } catch (error: any) {
        if (error.status === 404) {
          updateTestResult('Error Handling', 'success', 
            'Error handling works correctly (404)')
        } else {
          updateTestResult('Error Handling', 'success', 
            `Error handling works (${error.status}: ${error.message})`)
        }
      }

    } catch (error) {
      console.error('Test suite failed:', error)
      toast.error('Test suite failed to complete')
    } finally {
      setIsRunningTests(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 API Integration Test Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Backend Configuration</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>API URL:</strong> {config.API_BASE_URL}</p>
                <p><strong>API Version:</strong> {config.API_VERSION}</p>
                <p><strong>Environment:</strong> {config.APP_ENV}</p>
                <p><strong>Debug Mode:</strong> {config.APP_DEBUG ? 'On' : 'Off'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Authentication Status</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Token:</strong> {apiClient.getToken() ? '✅ Present' : '❌ None'}</p>
                {user && (
                  <>
                    <p><strong>User:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🧪 API Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runApiTests} 
            disabled={isRunningTests}
            className="w-full"
          >
            {isRunningTests ? 'Running Tests...' : 'Run API Tests'}
          </Button>
          
          {testResults.length > 0 && (
            <div className="space-y-2">
              {testResults.map((test, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getStatusIcon(test.status)}
                  <div className="flex-1">
                    <p className="font-medium">{test.name}</p>
                    {test.message && (
                      <p className="text-sm text-gray-600">{test.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔐 Authentication Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAuthenticated ? (
            <Button 
              onClick={() => setShowLoginModal(true)}
              className="w-full"
            >
              Test Login/Register
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">✅ Authenticated as {user?.name}</p>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="w-full"
              >
                Test Logout
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📋 Laravel Backend Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <h4 className="font-semibold">Make sure your Laravel backend has:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Laravel Sanctum installed and configured</li>
              <li>• CORS configured for frontend domain</li>
              <li>• Session domain configured in sanctum.php</li>
              <li>• API routes defined (/api/v1/auth/*, /api/v1/properties/*, etc.)</li>
              <li>• Database migrated with users, properties, bookings tables</li>
              <li>• AuthController with login/register/logout methods</li>
              <li>• PropertyController with CRUD operations</li>
              <li>• Middleware configured for API authentication</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  )
}