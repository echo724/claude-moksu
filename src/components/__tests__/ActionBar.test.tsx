import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ActionBar } from '../ActionBar'

describe('ActionBar', () => {
  const mockDownload = vi.fn()
  const mockCopy = vi.fn()
  const mockImport = vi.fn()
  const mockReset = vi.fn()

  beforeEach(() => {
    mockDownload.mockClear()
    mockCopy.mockClear()
    mockImport.mockClear()
    mockReset.mockClear()
  })

  it('should not show validation error when hasErrors is false', () => {
    render(
      <ActionBar
        onDownload={mockDownload}
        onCopy={mockCopy}
        onImport={mockImport}
        onReset={mockReset}
        hasErrors={false}
      />
    )

    expect(screen.queryByText('Settings have validation errors')).not.toBeInTheDocument()
  })

  it('should render with errors', () => {
    render(
      <ActionBar
        onDownload={mockDownload}
        onCopy={mockCopy}
        onImport={mockImport}
        onReset={mockReset}
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
        onReset={mockReset}
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
        onReset={mockReset}
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
        onReset={mockReset}
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
        onReset={mockReset}
        hasErrors={false}
      />
    )

    fireEvent.click(screen.getByText('Copy JSON'))

    expect(await screen.findByText('Copied!')).toBeInTheDocument()
  })

  it('should show confirmation dialog when reset button is clicked', () => {
    render(
      <ActionBar
        onDownload={mockDownload}
        onCopy={mockCopy}
        onImport={mockImport}
        onReset={mockReset}
        hasErrors={false}
      />
    )

    fireEvent.click(screen.getByText('Reset All'))

    expect(screen.getByText('Reset All Settings?')).toBeInTheDocument()
  })

  it('should call onReset when confirmation is accepted', () => {
    render(
      <ActionBar
        onDownload={mockDownload}
        onCopy={mockCopy}
        onImport={mockImport}
        onReset={mockReset}
        hasErrors={false}
      />
    )

    fireEvent.click(screen.getByText('Reset All'))
    fireEvent.click(screen.getByText('Reset All Settings'))

    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('should not call onReset when confirmation is cancelled', () => {
    render(
      <ActionBar
        onDownload={mockDownload}
        onCopy={mockCopy}
        onImport={mockImport}
        onReset={mockReset}
        hasErrors={false}
      />
    )

    fireEvent.click(screen.getByText('Reset All'))
    fireEvent.click(screen.getByText('Cancel'))

    expect(mockReset).not.toHaveBeenCalled()
  })
})
