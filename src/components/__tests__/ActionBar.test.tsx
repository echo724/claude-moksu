import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ActionBar } from '../ActionBar'

describe('ActionBar', () => {
  const mockDownload = vi.fn()
  const mockCopy = vi.fn()
  const mockImport = vi.fn()

  it('should render with no errors', () => {
    render(
      <ActionBar
        onDownload={mockDownload}
        onCopy={mockCopy}
        onImport={mockImport}
        hasErrors={false}
      />
    )

    expect(screen.getByText('Settings are valid')).toBeInTheDocument()
  })

  it('should render with errors', () => {
    render(
      <ActionBar
        onDownload={mockDownload}
        onCopy={mockCopy}
        onImport={mockImport}
        hasErrors={true}
      />
    )

    expect(screen.getByText('Settings have validation errors')).toBeInTheDocument()
  })

  it('should call onDownload when download button is clicked', () => {
    render(
      <ActionBar
        onDownload={mockDownload}
        onCopy={mockCopy}
        onImport={mockImport}
        hasErrors={false}
      />
    )

    fireEvent.click(screen.getByText('Download settings.json'))

    expect(mockDownload).toHaveBeenCalledTimes(1)
  })

  it('should disable download button when there are errors', () => {
    render(
      <ActionBar
        onDownload={mockDownload}
        onCopy={mockCopy}
        onImport={mockImport}
        hasErrors={true}
      />
    )

    const downloadButton = screen.getByText('Download settings.json').closest('button')

    expect(downloadButton).toBeDisabled()
  })

  it('should call onCopy when copy button is clicked', async () => {
    render(
      <ActionBar
        onDownload={mockDownload}
        onCopy={mockCopy}
        onImport={mockImport}
        hasErrors={false}
      />
    )

    fireEvent.click(screen.getByText('Copy JSON'))

    expect(mockCopy).toHaveBeenCalledTimes(1)
  })

  it('should show success message after copying', async () => {
    render(
      <ActionBar
        onDownload={mockDownload}
        onCopy={mockCopy}
        onImport={mockImport}
        hasErrors={false}
      />
    )

    fireEvent.click(screen.getByText('Copy JSON'))

    expect(await screen.findByText('Copied!')).toBeInTheDocument()
  })
})
