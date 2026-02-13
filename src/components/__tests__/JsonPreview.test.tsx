import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JsonPreview } from '../JsonPreview'

describe('JsonPreview', () => {
  it('should render with JSON content always visible', () => {
    render(<JsonPreview json='{"test": "value"}' />)

    expect(screen.getByText('JSON Preview')).toBeInTheDocument()
    expect(screen.getByText(/"test":/)).toBeInTheDocument()
  })

  it('should display empty state when no JSON provided', () => {
    render(<JsonPreview json='' />)

    expect(screen.getByText('JSON Preview')).toBeInTheDocument()
    expect(screen.getByText(/Settings will appear here/)).toBeInTheDocument()
  })

  it('should display validation error count', () => {
    const errors = ['Error 1', 'Error 2']
    render(<JsonPreview json='{}' validationErrors={errors} />)

    expect(screen.getByText('2 errors')).toBeInTheDocument()
  })

  it('should show validation error details', () => {
    const errors = ['Field is required', 'Invalid format']
    render(<JsonPreview json='{}' validationErrors={errors} />)

    expect(screen.getByText('Validation Errors:')).toBeInTheDocument()
    expect(screen.getByText('Field is required')).toBeInTheDocument()
    expect(screen.getByText('Invalid format')).toBeInTheDocument()
  })

  it('should display single error without plural', () => {
    const errors = ['Single error']
    render(<JsonPreview json='{}' validationErrors={errors} />)

    expect(screen.getByText('1 error')).toBeInTheDocument()
  })
})
