'use client'

interface DescriptionSectionProps {
  data: any
  onUpdate: (field: string, value: any) => void
}

export default function DescriptionSection({ data, onUpdate }: DescriptionSectionProps) {
  return (
    <div className="bg-white rounded-2xl border-3 border-black shadow-card p-6">
      <h2 className="text-xl font-display font-black text-black mb-6">Problem Description</h2>
      
      <div className="space-y-4">
        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={data.description}
            onChange={(e) => onUpdate('description', e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-semibold resize-none"
            placeholder="Describe the problem in detail..."
            required
          />
        </div>

        {/* Diagram Upload/URL */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Diagram (optional)
          </label>
          
          <div className="space-y-3">
            {/* Tab Selection */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onUpdate('diagram_upload_type', 'url')}
                className={`px-4 py-2 rounded-lg font-bold border-2 transition-colors ${
                  (data.diagram_upload_type || 'url') === 'url'
                    ? 'bg-secondary-500 text-white border-black'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => onUpdate('diagram_upload_type', 'upload')}
                className={`px-4 py-2 rounded-lg font-bold border-2 transition-colors ${
                  data.diagram_upload_type === 'upload'
                    ? 'bg-secondary-500 text-white border-black'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                Upload File
              </button>
            </div>

            {/* URL Input */}
            {(data.diagram_upload_type || 'url') === 'url' && (
              <input
                type="url"
                value={data.diagram_url}
                onChange={(e) => onUpdate('diagram_url', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-semibold"
                placeholder="https://example.com/diagram.png"
              />
            )}

            {/* File Upload */}
            {data.diagram_upload_type === 'upload' && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      // Create preview URL
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        onUpdate('diagram_url', reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary-500 focus:outline-none font-semibold file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-bold file:bg-primary-500 file:text-white hover:file:bg-primary-600"
                />
                <p className="text-sm text-gray-600 mt-2">Upload PNG, JPG, or SVG (max 5MB)</p>
              </div>
            )}

            {/* Preview */}
            {data.diagram_url && (
              <div className="mt-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                <p className="text-sm font-bold text-gray-700 mb-2">Preview:</p>
                <img 
                  src={data.diagram_url} 
                  alt="Diagram preview" 
                  className="max-w-full h-auto max-h-64 rounded-lg border-2 border-gray-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  )
}
