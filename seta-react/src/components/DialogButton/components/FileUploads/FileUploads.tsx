import { useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { FileUpload } from 'primereact/fileupload'
import { ProgressBar } from 'primereact/progressbar'
import { Tag } from 'primereact/tag'

export const FileUploads = ({ onChange }) => {
  const [totalSize, setTotalSize] = useState(0)
  const fileUploadRef = useRef(null)

  const onTemplateSelect = e => {
    let _totalSize = totalSize

    _totalSize += e.files[0].size
    setTotalSize(_totalSize)

    onChange(e.files[0])
  }
  const onTemplateUpload = e => {
    let _totalSize = 0

    _totalSize += e.files[0] || 0
    setTotalSize(_totalSize)
  }

  const onTemplateRemove = (file, callback) => {
    setTotalSize(totalSize - file.size)
    callback()
  }

  const onTemplateClear = () => {
    setTotalSize(0)
  }

  const headerTemplate = options => {
    const { className, chooseButton, uploadButton, cancelButton } = options
    const value = totalSize / 50000
    const formattedValue = fileUploadRef && fileUploadRef.current ? totalSize : '0 B'

    return (
      <div
        className={className}
        style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}
      >
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <ProgressBar
          value={value}
          displayValueTemplate={() => `${formattedValue} / 5 MB`}
          style={{ width: '300px', height: '20px', marginLeft: 'auto' }}
        />
      </div>
    )
  }

  const itemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: '49%' }}>
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    )
  }

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-file mt-3 p-5"
          style={{
            fontSize: '5em',
            borderRadius: '50%',
            backgroundColor: 'var(--surface-b)',
            color: 'var(--surface-d)'
          }}
        />
        <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
          Drag and Drop Document Here
        </span>
      </div>
    )
  }

  const chooseOptions = {
    icon: 'pi pi-fw pi-folder-open',
    iconOnly: true,
    className: 'custom-choose-btn p-button-rounded p-button-outlined'
  }

  const uploadOptions = {
    icon: 'pi pi-fw pi-cloud-upload',
    iconOnly: true,
    className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'
  }

  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    iconOnly: true,
    className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'
  }

  return (
    <div>
      <div className="card">
        <h5 className="h5_style">Upload document or Enter text to start searching documents</h5>
        <FileUpload
          ref={fileUploadRef}
          name="file_upload"
          url="https://primefaces.org/primereact/showcase/upload.php"
          accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
          maxFileSize={5000000}
          onUpload={onTemplateUpload}
          onSelect={onTemplateSelect}
          onError={onTemplateClear}
          onClear={onTemplateClear}
          headerTemplate={headerTemplate}
          itemTemplate={itemTemplate}
          emptyTemplate={emptyTemplate}
          chooseOptions={chooseOptions}
          uploadOptions={uploadOptions}
          cancelOptions={cancelOptions}
        />
        <h5 className="h5_style">OR</h5>
      </div>
    </div>
  )
}

export default FileUploads
