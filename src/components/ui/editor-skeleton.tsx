import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function EditorHeaderSkeleton() {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-48" />
          </div>
          
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function EditorFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        {/* Tabs */}
        <div className="grid w-full grid-cols-4 mb-6">
          <Skeleton className="h-10 rounded-l-md" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10 rounded-r-md" />
        </div>
        
        {/* Form Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function EditorPreviewSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-20" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Header do currículo */}
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-36 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
          
          {/* Seções */}
          <div className="space-y-4">
            <div>
              <Skeleton className="h-6 w-24 mb-3" />
              <Skeleton className="h-16 w-full" />
            </div>
            
            <div>
              <Skeleton className="h-6 w-32 mb-3" />
              <div className="space-y-3">
                <div className="border-l-2 border-gray-200 pl-4">
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="border-l-2 border-gray-200 pl-4">
                  <Skeleton className="h-5 w-36 mb-1" />
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
            
            <div>
              <Skeleton className="h-6 w-28 mb-3" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function EditorLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <EditorHeaderSkeleton />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-6">
            <EditorFormSkeleton />
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <EditorPreviewSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
