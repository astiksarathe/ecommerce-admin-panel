/* eslint-disable react/prop-types */
import React from 'react'
import {
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
const VariantModal = ({ isVisible, closeVariantModel, variant, variantDetailChangeHandler }) => {
  return (
    <CModal alignment="center" visible={isVisible} onClose={closeVariantModel}>
      <CModalHeader>
        <CModalTitle>{variant?.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div className="mb-3">
            <CFormLabel htmlFor="thumbnilImg">Product Image</CFormLabel>
            <CFormInput
              name="thumbnilImg"
              value={variant?.productImg}
              onChange={(e) => {
                variantDetailChangeHandler(e)
              }}
              type="file"
              id="thumbnilImg"
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="MRP">Product MRP</CFormLabel>
            <CFormInput
              name="price.MRP"
              value={variant?.price?.MRP}
              onChange={(e) => {
                variantDetailChangeHandler(e)
              }}
              type="number"
              id="MRP"
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="sellingPrice">Product Selling Price</CFormLabel>
            <CFormInput
              name="price.sellingPrice"
              value={variant?.price?.sellingPrice}
              onChange={(e) => {
                variantDetailChangeHandler(e)
              }}
              type="number"
              id="sellingPrice"
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="cost">Product Cost</CFormLabel>
            <CFormInput
              name="price.cost"
              value={variant?.price?.cost}
              onChange={(e) => {
                variantDetailChangeHandler(e)
              }}
              type="number"
              id="cost"
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="sku">Product SKU</CFormLabel>
            <CFormInput
              name="sku"
              value={variant?.sku}
              onChange={(e) => {
                variantDetailChangeHandler(e)
              }}
              type="text"
              id="sku"
            />
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={closeVariantModel}>
          Close
        </CButton>
        <CButton color="primary">Save changes</CButton>
      </CModalFooter>
    </CModal>
  )
}

export default VariantModal
