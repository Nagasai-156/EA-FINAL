const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export const API_ENDPOINTS = {
  problems: `${API_BASE_URL}/api/problems`,
  files: (problemId: string) => `${API_BASE_URL}/api/files/${problemId}`,
  health: `${API_BASE_URL}/health`
}

export async function createProblem(data: any) {
  const response = await fetch(API_ENDPOINTS.problems, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create problem')
  }
  
  return response.json()
}

export async function uploadCodeFile(
  problemId: string,
  type: string,
  language: string,
  content: string
) {
  const formData = new FormData()
  formData.append('type', type)
  formData.append('language', language)
  formData.append('content', content)

  const response = await fetch(API_ENDPOINTS.files(problemId), {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to upload ${language} ${type}: ${error.error}`)
  }

  return response.json()
}

export async function getProblems() {
  const response = await fetch(API_ENDPOINTS.problems)
  
  if (!response.ok) {
    throw new Error('Failed to fetch problems')
  }
  
  return response.json()
}

export async function getProblemBySlug(slug: string) {
  const response = await fetch(`${API_ENDPOINTS.problems}/${slug}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch problem')
  }
  
  return response.json()
}
