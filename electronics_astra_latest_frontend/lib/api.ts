const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export const API_ENDPOINTS = {
  problems: `${API_BASE_URL}/api/problems`,
  problemBySlug: (slug: string) => `${API_BASE_URL}/api/problems/${slug}`,
  problemById: (id: number) => `${API_BASE_URL}/api/problems/${id}`,
  health: `${API_BASE_URL}/health`,
  submitSolution: `${API_BASE_URL}/api/submissions`,
  runCode: `${API_BASE_URL}/api/submissions/run`
}

export async function getProblems() {
  const response = await fetch(API_ENDPOINTS.problems)
  if (!response.ok) throw new Error('Failed to fetch problems')
  return response.json()
}

export async function getProblemBySlug(slug: string) {
  const response = await fetch(API_ENDPOINTS.problemBySlug(slug))
  if (!response.ok) throw new Error('Failed to fetch problem')
  return response.json()
}

export async function getProblemById(id: number) {
  try {
    console.log('getProblemById called with id:', id)
    
    // Get all published problems
    const problems = await getPublishedProblems()
    console.log('Total published problems:', problems.length)
    
    // Find problem by index (id is 1-based, array is 0-based)
    if (id > 0 && id <= problems.length) {
      const problem = problems[id - 1]
      console.log('Found problem at index:', problem.slug)
      
      // Now fetch full details using the slug
      const url = API_ENDPOINTS.problemBySlug(problem.slug)
      console.log('Fetching full details from:', url)
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        console.log('Full problem data:', data)
        return data
      } else {
        console.error('Failed to fetch problem details:', response.status, response.statusText)
      }
    } else {
      console.error('Problem ID out of range:', id, 'Total problems:', problems.length)
    }
    
    throw new Error('Problem not found')
  } catch (error) {
    console.error('Error fetching problem:', error)
    throw error
  }
}

export async function getPublishedProblems() {
  const problems = await getProblems()
  return problems.filter((p: any) => p.isActive === true)
}

export async function runCode(problemId: number, code: string, language: string) {
  const response = await fetch(API_ENDPOINTS.runCode, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      problemId,
      code,
      language,
      runType: 'sample' // Run only sample test cases
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to run code')
  }
  
  return response.json()
}

export async function submitSolution(problemId: number, code: string, language: string) {
  const response = await fetch(API_ENDPOINTS.submitSolution, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      problemId,
      code,
      language,
      runType: 'full' // Run all test cases
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to submit solution')
  }
  
  return response.json()
}

export async function getUserSubmissions(problemId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/submissions/problem/${problemId}`)
    if (!response.ok) {
      if (response.status === 404) {
        return [] // No submissions yet
      }
      throw new Error('Failed to fetch submissions')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return [] // Return empty array on error
  }
}
