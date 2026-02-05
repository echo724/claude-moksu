import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { JsonPreview } from '../JsonPreview'

describe('JsonPreview', () => {
  it('should render collapsed by default', () => {
    render(<JsonPreview json='{"test": "value"}' />)

    expect(screen.getByText('JSON Preview')).toBeInTheDocument()
    expect(screen.queryByText(/"test":/)).not.toBeInTheDocument()
  })

  it('should expand when clicked', () => {
    render(<JsonPreview json='{"test": "value"}' />)

    fireEvent.click(screen.getByText('JSON Preview'))

    expect(screen.getByText(/"test":/)).toBeInTheDocument()
  })

  it('should display validation errors', () => {
    const errors = ['Error 1', 'Error 2']
    render(<JsonPreview json='{}' validationErrors={errors} />)

    expect(screen.getByText('2 errors')).toBeInTheDocument()
  })

  it('should show error details when expanded', () => {
    const errors = ['Field is required', 'Invalid format']
    render(<JsonPreview json='{}' validationErrors={errors} />)

    fireEvent.click(screen.getByText('JSON Preview'))

    expect(screen.getByText('Field is required')).toBeInTheDocument()
    expect(screen.getByText('Invalid format')).toBeInTheDocument()
  })

  it('should collapse when clicked again', () => {
    render(<JsonPreview json='{"test": "value"}' />)

    // Expand
    fireEvent.click(screen.getByText('JSON Preview'))
    expect(screen.getByText(/"test":/)).toBeInTheDocument()

    // Collapse
    fireEvent.click(screen.getByText('JSON Preview'))
    expect(screen.queryByText(/"test":/)).not.toBeInTheDocument()
  })
})
