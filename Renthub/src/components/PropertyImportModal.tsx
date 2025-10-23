import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  UploadSimple, 
  FileCsv, 
  FileXls, 
  CheckCircle, 
  WarningCircle, 
  XCircle,
  Download,
  Info,
  Lightning,
  MagicWand
} from '@phosphor-icons/react'
import { Property } from '@/lib/types'
import { parseCSV, parseExcel, validatePropertyData, generateSampleCSV } from '@/lib/importUtils'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface PropertyImportModalProps {
  open: boolean
  onClose: () => void
  onImport: (properties: Property[]) => void
}

type ImportStep = 'upload' | 'preview' | 'processing' | 'complete'

interface ValidationError {
  row: number
  field: string
  message: string
}

interface ParsedProperty {
  data: Partial<Property>
  valid: boolean
  errors: ValidationError[]
}

export function PropertyImportModal({ open, onClose, onImport }: PropertyImportModalProps) {
  const [step, setStep] = useState<ImportStep>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedProperty[]>([])
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleFileSelect = async (selectedFile: File) => {
    const fileName = selectedFile.name.toLowerCase()
    
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      toast.error('Please upload a CSV or Excel file')
      return
    }

    setFile(selectedFile)
    setStep('processing')
    setProgress(10)

    try {
      let rawData: any[]
      
      if (fileName.endsWith('.csv')) {
        rawData = await parseCSV(selectedFile)
      } else {
        rawData = await parseExcel(selectedFile)
      }

      setProgress(50)

      const validated = rawData.map((row, index) => {
        const errors = validatePropertyData(row)
        return {
          data: row,
          valid: errors.length === 0,
          errors: errors.map(err => ({ ...err, row: index + 2 }))
        }
      })

      setProgress(100)
      setParsedData(validated)
      setStep('preview')
      
      const validCount = validated.filter(p => p.valid).length
      const errorCount = validated.filter(p => !p.valid).length
      
      if (errorCount === 0) {
        toast.success(`Successfully parsed ${validCount} properties`)
      } else {
        toast.warning(`Parsed ${validCount} valid properties, ${errorCount} with errors`)
      }
    } catch (error) {
      console.error('Import error:', error)
      toast.error('Failed to parse file. Please check the format.')
      setStep('upload')
      setFile(null)
    }
  }

  const handleImport = () => {
    const validProperties = parsedData
      .filter(p => p.valid)
      .map(p => ({
        ...p.data,
        id: `property-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        available: true,
        views: 0,
        favorites: 0
      } as Property))

    if (validProperties.length === 0) {
      toast.error('No valid properties to import')
      return
    }

    onImport(validProperties)
    toast.success(`Successfully imported ${validProperties.length} properties!`)
    handleClose()
  }

  const handleDownloadSample = () => {
    const csv = generateSampleCSV()
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'property-import-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    toast.success('Template downloaded')
  }

  const handleClose = () => {
    setStep('upload')
    setFile(null)
    setParsedData([])
    setProgress(0)
    onClose()
  }

  const validCount = parsedData.filter(p => p.valid).length
  const errorCount = parsedData.filter(p => !p.valid).length

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <UploadSimple className="w-5 h-5 text-white" weight="bold" />
            </div>
            Import Properties
          </DialogTitle>
          <DialogDescription>
            Bulk import properties from CSV or Excel files
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    Upload a CSV or Excel file with your property data. Download the template below to see the required format.
                  </AlertDescription>
                </Alert>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-2xl p-12 text-center transition-all
                    ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50'}
                  `}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <UploadSimple className="w-8 h-8 text-primary" weight="bold" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">Drop your file here</h3>
                      <p className="text-sm text-muted-foreground">
                        or click to browse
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Badge variant="secondary" className="gap-2">
                        <FileCsv className="w-4 h-4" weight="bold" />
                        CSV
                      </Badge>
                      <Badge variant="secondary" className="gap-2">
                        <FileXls className="w-4 h-4" weight="bold" />
                        Excel
                      </Badge>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0]
                        if (selectedFile) handleFileSelect(selectedFile)
                      }}
                      className="hidden"
                    />

                    <Button
                      size="lg"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4"
                    >
                      <UploadSimple className="w-5 h-5 mr-2" weight="bold" />
                      Choose File
                    </Button>
                  </div>
                </div>

                <Card className="p-6 bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Download className="w-5 h-5 text-accent" weight="bold" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold">Need a template?</h4>
                      <p className="text-sm text-muted-foreground">
                        Download our CSV template with sample data and all required fields
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadSample}
                        className="mt-2"
                      >
                        <Download className="w-4 h-4 mr-2" weight="bold" />
                        Download Template
                      </Button>
                    </div>
                  </div>
                </Card>

                <Tabs defaultValue="required" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="required" className="flex-1">Required Fields</TabsTrigger>
                    <TabsTrigger value="optional" className="flex-1">Optional Fields</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="required" className="space-y-2 mt-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {['title', 'description', 'price', 'location', 'type', 'rentalTerm', 'bedrooms', 'bathrooms', 'area'].map(field => (
                        <div key={field} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" weight="fill" />
                          <span className="font-medium">{field}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="optional" className="space-y-2 mt-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {['images', 'amenities', 'ownerName', 'ownerEmail', 'ownerPhone'].map(field => (
                        <div key={field} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                          <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span>{field}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      * For multiple images or amenities, separate values with semicolons (;)
                    </p>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 space-y-6"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Lightning className="w-10 h-10 text-primary animate-pulse" weight="fill" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Processing your file...</h3>
                  <p className="text-muted-foreground">Parsing and validating property data</p>
                </div>
                <div className="w-full max-w-md space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">{progress}%</p>
                </div>
              </motion.div>
            )}

            {step === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 h-full flex flex-col"
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex gap-3">
                    <Badge variant="default" className="gap-2 bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                      <CheckCircle className="w-4 h-4" weight="fill" />
                      {validCount} Valid
                    </Badge>
                    {errorCount > 0 && (
                      <Badge variant="destructive" className="gap-2">
                        <XCircle className="w-4 h-4" weight="fill" />
                        {errorCount} Errors
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep('upload')}>
                      Upload Different File
                    </Button>
                    <Button 
                      onClick={handleImport}
                      disabled={validCount === 0}
                      className="gap-2"
                    >
                      <MagicWand className="w-4 h-4" weight="bold" />
                      Import {validCount} {validCount === 1 ? 'Property' : 'Properties'}
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-3">
                    {parsedData.map((item, index) => (
                      <Card key={index} className={`p-4 ${item.valid ? 'border-green-500/20' : 'border-destructive/50'}`}>
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            item.valid ? 'bg-green-500/10' : 'bg-destructive/10'
                          }`}>
                            {item.valid ? (
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" weight="fill" />
                            ) : (
                              <WarningCircle className="w-5 h-5 text-destructive" weight="fill" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1 flex-1 min-w-0">
                                <h4 className="font-semibold truncate">{item.data.title || 'Untitled Property'}</h4>
                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                  {item.data.location && (
                                    <span>{item.data.location}</span>
                                  )}
                                  {item.data.price && (
                                    <span>• ${item.data.price}/mo</span>
                                  )}
                                  {item.data.bedrooms && (
                                    <span>• {item.data.bedrooms} bed</span>
                                  )}
                                  {item.data.type && (
                                    <Badge variant="secondary" className="text-xs">
                                      {item.data.type}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <Badge variant="outline" className="flex-shrink-0">
                                Row {index + 2}
                              </Badge>
                            </div>

                            {!item.valid && item.errors.length > 0 && (
                              <div className="mt-3 space-y-1.5">
                                {item.errors.map((error, errorIndex) => (
                                  <div key={errorIndex} className="flex items-start gap-2 text-sm">
                                    <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" weight="fill" />
                                    <span className="text-destructive">
                                      <span className="font-medium">{error.field}:</span> {error.message}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
