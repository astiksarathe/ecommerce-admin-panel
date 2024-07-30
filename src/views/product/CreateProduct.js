import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react'
import { EditorState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './createProduct.scss'

import { getOptionCombinations } from './product.helper'
import axios from 'axios'
import { Link } from 'react-router-dom'
import VariantModal from './VariantModal'
import Multiselect from 'multiselect-react-dropdown'
import TreeMultiSelect from './TreeMultiSelect/TreeMultiSelect'
import { Select } from 'antd'
const CreateProduct = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [shortDescription, setShortDescription] = useState(() => EditorState.createEmpty())
  const [variants, setVariants] = useState([])
  const [variantModelVisible, setVariantModelVisible] = useState(false)
  const [productForm, setProductForm] = useState({
    SKU: '',
    title: '',
    description: '',
    shortDescription: '',
    specification: [],
    fields: [],
    category: [],
    productType: '',
    vendor: [''],
    variantAvailable: false,
    inventory: '',
    thumbnilImg: '',
    images: [],
    price: {
      MRP: 0,
      currencyCode: 'INR',
      sellingPrice: 0,
      cost: 0,
      minPrice: 0,
      maxPrice: 0,
    },
    tags: [],
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      unit: 'CM',
    },
    weight: 0,
    weightUnit: 'GRAM',
    taxIncluded: false,
    isReturnAvailable: false,
    isReplaceable: false,
    warrantyInMonths: 0,
    CODAvailable: false,
    preOrderBookingAvailable: false,
    FAQ: [],
    status: 'DRAFT',
  })
  const [allVariant, setAllVariant] = useState([])
  const [currentVariant, setCurrentVariant] = useState({})
  const [vendorList, setVendorList] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState)
  }

  const addCustomField = () => {
    const field = {
      fieldType: '',
      fieldName: '',
      fieldPlaceholder: '',
      fieldLabel: '',
      minLength: 0,
      maxLength: 0,
      isRequired: false,
    }
    setProductForm((pre) => ({ ...pre, fields: [...pre.fields, field] }))
  }
  const onSubmitHandler = () => {
    const description = convertToRaw(editorState.getCurrentContent())
    axios
      .post('http://localhost:8000/api/v1/product', {
        ...productForm,
        description,
        shortDescription,
        variants: allVariant,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  const checkboxHandler = (e) => {
    const { checked, name } = e.target
    setProductForm((pre) => ({
      ...pre,
      [name]: checked,
    }))
  }

  const addVariantOption = () => {
    const variantOption = { optionName: '', optionValue: [''] }
    if (variants.length === 3) return null
    setVariants((pre) => {
      const updateState = pre.map((val) => val)
      updateState.push(variantOption)
      return updateState
    })
  }

  useEffect(() => {
    const output = getOptionCombinations(variants, {
      productImg: '',
      sku: '',
      price: {
        MRP: productForm.price.MRP,
        currencyCode: 'INR',
        sellingPrice: productForm.price.sellingPrice,
        cost: productForm.price.cost,
      },
    })

    setAllVariant(output)
  }, [variants])

  const deleteVariantOption = (ind) => {
    setVariants((pre) => {
      return pre.filter((_, i) => ind !== i)
    })
  }
  const addOptionValues = (ind) => {
    setVariants((currentValue) => {
      const updatedVariants = [...currentValue]
      updatedVariants[ind].optionValue = [...updatedVariants[ind].optionValue, '']
      return updatedVariants
    })
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    const keys = name.split('.')
    if (keys.length === 2) {
      setProductForm({
        ...productForm,
        [keys[0]]: {
          ...productForm[keys[0]],
          [keys[1]]: value,
        },
      })
    } else {
      setProductForm({
        ...productForm,
        [name]: value,
      })
    }
  }
  const optionValueHandler = (optionNameInd, optionValueInd, value) => {
    setVariants((currentState) => {
      const updateState = [...currentState]
      updateState[optionNameInd].optionValue[optionValueInd] = value
      return updateState
    })
  }
  const optionNameHandler = (optionNameInd, val) => {
    setVariants((currentValue) => {
      const updateValue = JSON.parse(JSON.stringify(currentValue))
      updateValue[optionNameInd].optionName = val
      return updateValue
    })
  }
  const deleteOptionValues = (optionNameInd, optionValueInd) => {
    setVariants((currentValue) => {
      const updatedVariants = [...currentValue]
      const currentOptionValues = [...updatedVariants[optionNameInd].optionValue]
      const updatedOV = currentOptionValues.filter((val, ind) => ind !== optionValueInd) // Change here
      updatedVariants[optionNameInd].optionValue = updatedOV
      return updatedVariants
    })
  }

  const handleSpecificationChange = (index, field, value) => {
    const newSpecifications = productForm.specification.map((spec, specIndex) => {
      if (index === specIndex) {
        return { ...spec, [field]: value }
      }
      return spec
    })
    setProductForm({ ...productForm, specification: newSpecifications })
  }

  const handleAddSpecification = () => {
    setProductForm({
      ...productForm,
      specification: [...productForm.specification, { key: '', value: '' }],
    })
  }

  const handleRemoveSpecification = (index) => {
    const newSpecifications = productForm.specification.filter(
      (_, specIndex) => index !== specIndex,
    )
    setProductForm({ ...productForm, specification: newSpecifications })
  }
  const closeVariantModel = () => {
    setVariantModelVisible(false)
  }

  const openVariantModel = () => {
    setVariantModelVisible(true)
  }
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/v1/vendor')
      .then((res) => {
        const list = res.data.data.map((vendor) => ({ name: vendor.vendorName, id: vendor._id }))
        setVendorList(list)
      })
      .catch((err) => console.log(err))
    axios
      .get('http://localhost:8000/api/v1/category/root')
      .then((res) => {
        const list = res.data.data.map((category) => ({
          title: category.categoryName,
          value: category.categoryID,
          id: category.categoryID,
          pId: 0,
          key: category.categoryID,
          isLeaf: category.isLeaf,
        }))
        setCategories(list)
      })
      .catch((err) => console.log(err))
    axios
      .get('http://localhost:8000/api/v1/list/tags')
      .then((res) => {
        const list = res.data.data[0].value
          .map((name, ind) => ({
            value: name,
            label: name,
            key: ind,
          }))
          .filter(({ value }) => value !== null)
        setTags(list)
      })
      .catch((err) => console.log(err))
  }, [])
  useEffect(() => {
    const updateVariantList = () => {
      const updatedList = allVariant.map((variant) => {
        if (variant.title === currentVariant.title) {
          return { ...currentVariant }
        }
        return variant
      })
      setAllVariant(updatedList)
    }
    updateVariantList()
  }, [currentVariant])

  const getSubCategories = ({ id }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`http://localhost:8000/api/v1/category/child/${id}`)
        .then((res) => {
          const list = res.data.data.map((category) => ({
            title: category.categoryName,
            value: category.categoryID,
            id: category.categoryID,
            pId: id,
            key: category.categoryID,
            children: category.childCategories,
            isLeaf: category.isLeaf,
          }))
          setCategories(categories.concat(list))
          resolve()
        })
        .catch((err) => reject(err))
    })
  }
  const variantDetailChangeHandler = (e) => {
    const { name, value } = e.target
    const keys = name.split('.')
    if (keys.length === 2) {
      setCurrentVariant({
        ...currentVariant,
        [keys[0]]: {
          ...currentVariant[keys[0]],
          [keys[1]]: value,
        },
      })
    } else {
      setCurrentVariant({
        ...currentVariant,
        [name]: value,
      })
    }
  }

  function changeHandlerForMultiSelect(selectedList, name) {
    console.log(selectedList)
    if (name === 'vendor') {
      setProductForm((pre) => {
        return { ...pre, vendor: selectedList }
      })
    }
    if (name === 'category') {
      setProductForm((pre) => {
        return { ...pre, category: selectedList }
      })
    }
  }

  const changeCategory = (list) => {
    setProductForm((pre) => ({ ...pre, category: list }))
  }

  const tagHandler = (value) => {
    console.log(value)
    setProductForm((pre) => ({ ...pre, tags: value }))
  }
  const deleteCustomField = (ind) => {
    const newFields = productForm.fields.filter((_, specIndex) => ind !== specIndex)
    setProductForm({ ...productForm, fields: newFields })
  }
  const onChangeCustomField = (index, name, event) => {
    let val = event
    if (typeof event !== 'string') {
      val = event.target.value
    }
    if (name === 'minLength' || name === 'maxLength' || name === 'isRequired') {
      val = parseInt(val)
    }
    const updatedState = productForm.fields.map((field, ind) => {
      if (ind === index) {
        return {
          ...productForm.fields[index],
          [name]: val,
        }
      }
      return field
    })
    setProductForm((pre) => ({ ...pre, fields: updatedState }))
  }
  return (
    <CRow>
      <VariantModal
        variant={currentVariant}
        isVisible={variantModelVisible}
        closeVariantModel={closeVariantModel}
        variantDetailChangeHandler={variantDetailChangeHandler}
      />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Add Product</CCardHeader>
          <CCardBody>
            <CForm>
              <div className="mb-3">
                <CFormLabel htmlFor="product-sku">SKU</CFormLabel>
                <CFormInput
                  type="sku"
                  id="product-sku"
                  name="SKU"
                  value={productForm.SKU}
                  onChange={handleInputChange}
                  placeholder=""
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="product-title">Title</CFormLabel>
                <CFormInput
                  type="title"
                  name="title"
                  value={productForm.title}
                  onChange={handleInputChange}
                  id="product-title"
                  placeholder="Short sleeve t-shirt"
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="product-shortdescription">Short Description</CFormLabel>
                <Editor
                  name="description"
                  value={productForm.shortDescription}
                  editorState={shortDescription}
                  onEditorStateChange={(v) => {
                    setShortDescription(v)
                  }}
                  wrapperClassName="wrapper-class"
                  editorClassName="editor-class"
                  toolbarClassName="toolbar-class"
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="product-description">Description</CFormLabel>
                <Editor
                  name="description"
                  value={productForm.description}
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                  wrapperClassName="wrapper-class"
                  editorClassName="editor-class"
                  toolbarClassName="toolbar-class"
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="thumbnilImg">Thumbnil Image</CFormLabel>
                <CFormInput
                  name="thumbnilImg"
                  value={productForm.thumbnilImg}
                  onChange={handleInputChange}
                  type="file"
                  id="thumbnilImg"
                />
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Specification</CCardHeader>
          <CCardBody>
            {productForm.specification.map((spec, index) => (
              <CRow className="mt-2" key={index}>
                <CCol sm={11} lg={4} xs={11} md={4}>
                  <CFormInput
                    type="text"
                    placeholder="Key"
                    value={spec.key}
                    onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                  />
                </CCol>
                <CCol sm={11} lg={4} xs={11} md={4}>
                  <CFormInput
                    type="text"
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                  />{' '}
                </CCol>
                <CCol sm={4} lg={2} xs={4} md={2}>
                  <CButton
                    type="button"
                    color="danger"
                    onClick={() => handleRemoveSpecification(index)}
                  >
                    Remove
                  </CButton>
                </CCol>
              </CRow>
            ))}
            <CButton
              className="mt-2"
              type="button"
              onClick={handleAddSpecification}
              color="primary"
            >
              Add Specification
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Custom Fields</CCardHeader>
          <CCardBody>
            {productForm.fields.map((field, index) => (
              <CRow
                className={index == 0 ? 'mt-2' : 'mt-5'}
                key={index}
                style={{ borderTop: '1px solid gray' }}
              >
                <CCol sm={11} lg={4} xs={11} md={4}>
                  <CFormLabel htmlFor="field-type">Field Type</CFormLabel>
                  <Select
                    name="fieldType"
                    value={field.fieldType}
                    onChange={(e) => {
                      onChangeCustomField(index, 'fieldType', e)
                    }}
                    // value={spec.fieldType}
                    type="text"
                    id="field-type"
                    style={{
                      width: '100%',
                    }}
                    options={[
                      { value: 'IMAGE', label: 'Image', key: 1 },
                      { value: 'INPUT', label: 'Input', key: 2 },
                    ]}
                  />
                </CCol>
                <CCol sm={11} lg={4} xs={11} md={4}>
                  <CFormLabel>Name Attribute</CFormLabel>
                  <CFormInput
                    type="text"
                    placeholder="Name Attribute"
                    value={field.fieldName}
                    onChange={(e) => {
                      onChangeCustomField(index, 'fieldName', e)
                    }}
                  />
                </CCol>
                <CCol sm={11} lg={4} xs={11} md={4}>
                  <CFormLabel>Field Placeholder</CFormLabel>
                  <CFormInput
                    type="text"
                    placeholder="Field Placeholder"
                    value={field.fieldPlaceholder}
                    onChange={(e) => {
                      onChangeCustomField(index, 'fieldPlaceholder', e)
                    }}
                  />
                </CCol>
                <CCol sm={11} lg={4} xs={11} md={4}>
                  <CFormLabel>Field Label</CFormLabel>
                  <CFormInput
                    type="text"
                    placeholder="Field Label"
                    value={field.fieldLabel}
                    onChange={(e) => {
                      onChangeCustomField(index, 'fieldLabel', e)
                    }}
                  />
                </CCol>
                <CCol sm={11} lg={4} xs={11} md={4}>
                  <CFormLabel>Min Length Validation</CFormLabel>
                  <CFormInput
                    type="number"
                    placeholder="Min Length Validation"
                    value={field.minLength}
                    onChange={(e) => {
                      onChangeCustomField(index, 'minLength', e)
                    }}
                  />
                </CCol>
                <CCol sm={11} lg={4} xs={11} md={4}>
                  <CFormLabel>Max Length Validation</CFormLabel>
                  <CFormInput
                    type="number"
                    placeholder="Max Length Validation"
                    value={field.maxLength}
                    onChange={(e) => {
                      onChangeCustomField(index, 'maxLength', e)
                    }}
                  />
                </CCol>
                <CCol sm={11} lg={4} xs={11} md={4}>
                  <CFormLabel htmlFor="field-type">Required Validation</CFormLabel>
                  <Select
                    name="isRequired"
                    onChange={(e) => {
                      onChangeCustomField(index, 'isRequired', e)
                    }}
                    type="text"
                    id="field-type"
                    style={{
                      width: '100%',
                    }}
                    value={field.isRequired}
                    options={[
                      { value: 1, label: 'True', key: 1 },
                      { value: 0, label: 'False', key: 2 },
                    ]}
                  />
                </CCol>
                <CCol sm={4} lg={2} xs={4} md={2}>
                  <CButton type="button" color="danger" onClick={() => deleteCustomField(index)}>
                    Remove
                  </CButton>
                </CCol>
              </CRow>
            ))}
            <CButton className="mt-2" type="button" onClick={addCustomField} color="primary">
              Add Custom Field
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Product Organization</CCardHeader>
          <CCardBody>
            <CRow>
              <div className="mb-3">
                <CFormLabel htmlFor="category">Category</CFormLabel>
                <TreeMultiSelect
                  treeData={categories}
                  onLoadData={getSubCategories}
                  changeCategory={changeCategory}
                  value={productForm.category}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="product-type">Product Type</CFormLabel>
                <CFormInput
                  type="text"
                  name="productType"
                  onChange={handleInputChange}
                  value={productForm.productType}
                  id="product-type"
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="vendor">Vendor</CFormLabel>
                <Multiselect
                  id="vendor"
                  value={productForm.vendor}
                  aria-label="Select Vendor"
                  name="vendor"
                  options={vendorList}
                  onSelect={(selectedList) => changeHandlerForMultiSelect(selectedList, 'vendor')} // Function will trigger on select event
                  onRemove={(selectedList) => changeHandlerForMultiSelect(selectedList, 'vendor')} // Function will trigger on remove event
                  displayValue="name" // Property name to display in the dropdown options
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="product-tag">Product Tag</CFormLabel>
                <Select
                  name="tags"
                  onChange={tagHandler}
                  value={productForm.tags}
                  type="text"
                  id="product-tag"
                  mode="tags"
                  style={{
                    width: '100%',
                  }}
                  options={tags}
                />
              </div>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Price</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} sm={12} lg={6} md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="product-price">Product selling price</CFormLabel>
                  <CFormInput
                    name="price.sellingPrice"
                    value={productForm.price.sellingPrice}
                    onChange={handleInputChange}
                    type="number"
                    id="product-price"
                  />
                </div>
              </CCol>
              <CCol xs={12} sm={12} lg={6} md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="product-mrp">Product MRP</CFormLabel>
                  <CFormInput
                    name="price.MRP"
                    value={productForm.price.MRP}
                    onChange={handleInputChange}
                    type="number"
                    id="product-mrp"
                  />
                </div>
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12} sm={12} lg={6} md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="product-profit">Product Profit</CFormLabel>
                  <CFormInput name="profit" type="number" id="product-profit" />
                </div>
              </CCol>
              <CCol xs={12} sm={12} lg={6} md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="product-margin">Product Margin</CFormLabel>
                  <CFormInput name="margin" type="number" id="product-margin" />
                </div>
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12} sm={12} lg={6} md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="product-cost">Product Cost</CFormLabel>
                  <CFormInput
                    name="price.cost"
                    value={productForm.price.cost}
                    onChange={handleInputChange}
                    type="number"
                    id="product-cost"
                  />
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Variant</CCardHeader>
          <CCardBody>
            <div className="m-2">
              {variants?.map((option, ind) => (
                <React.Fragment key={ind}>
                  <div className="editor-class">
                    <div className="mb-3">
                      <CFormLabel htmlFor={`product-Option-name-${ind}`}>Option name</CFormLabel>
                      <CFormInput
                        type="text"
                        id={`product-Option-name-${ind}`}
                        value={variants[ind].optionName}
                        placeholder="size"
                        onChange={(e) => {
                          optionNameHandler(ind, e.target.value)
                        }}
                      />
                    </div>
                    {option.optionValue.map((val, i) => {
                      return (
                        <div className="mb-3" key={i}>
                          <CFormLabel htmlFor={`product-Option-value-${ind}-${i}`}>
                            Option value
                          </CFormLabel>
                          <CRow>
                            <CCol sm={8} lg={8} xs={8} md={8}>
                              <CFormInput
                                type="text"
                                value={variants[ind].optionValue[i]} // Change here
                                id={`product-Option-value-${ind}-${i}`}
                                placeholder="small"
                                onChange={(e) => optionValueHandler(ind, i, e.target.value)}
                              />
                            </CCol>
                            <CCol sm={2} lg={2} xs={2} md={2}>
                              <CButton color="danger" onClick={() => deleteOptionValues(ind, i)}>
                                Delete
                              </CButton>
                            </CCol>
                          </CRow>
                        </div>
                      )
                    })}
                    <CButton color="primary" onClick={() => addOptionValues(ind)}>
                      Add Value
                    </CButton>
                    <CButton
                      className="ml-1"
                      color="danger"
                      onClick={() => deleteVariantOption(ind)}
                    >
                      Delete Option
                    </CButton>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <CButton color={'primary'} onClick={() => addVariantOption()}>
              + Add another option
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>All Variants</CCardHeader>
          <CCardBody>
            {allVariant.length &&
              allVariant?.map((variant, index) => {
                return (
                  <React.Fragment key={index}>
                    <div>
                      <Link
                        onClick={() => {
                          setCurrentVariant(variant)
                          openVariantModel()
                        }}
                      >
                        {variant.title}
                      </Link>
                    </div>
                  </React.Fragment>
                )
              })}
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Dimension and weight</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} sm={12} lg={6} md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="product-length">Product length in cm</CFormLabel>
                  <CFormInput
                    name="dimensions.length"
                    value={productForm.dimensions.length}
                    onChange={handleInputChange}
                    type="number"
                    id="product-length"
                  />
                </div>
              </CCol>
              <CCol xs={12} sm={12} lg={6} md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="product-width">Product width in cm</CFormLabel>
                  <CFormInput
                    name="dimensions.width"
                    value={productForm.dimensions.width}
                    onChange={handleInputChange}
                    type="number"
                    id="product-width"
                  />
                </div>
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12} sm={12} lg={6} md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="product-height">Product height in cm</CFormLabel>
                  <CFormInput
                    name="dimensions.height"
                    value={productForm.dimensions.height}
                    onChange={handleInputChange}
                    type="number"
                    id="product-height"
                  />
                </div>
              </CCol>
              <CCol xs={12} sm={12} lg={6} md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="product-weight">Product weight in gram</CFormLabel>
                  <CFormInput
                    name="weight"
                    value={productForm.weight}
                    onChange={handleInputChange}
                    type="number"
                    id="product-weight"
                  />
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Metafields</CCardHeader>
          <CCardBody>
            <CRow>
              <div className="mb-3">
                <CFormCheck
                  checked={productForm.taxIncluded}
                  onChange={checkboxHandler}
                  name="taxIncluded"
                  id="taxIncluded"
                  label="Tax Included"
                />
              </div>
              <div className="mb-3">
                <CFormCheck
                  checked={productForm.isReturnAvailable}
                  onChange={checkboxHandler}
                  name="isReturnAvailable"
                  id="isReturnAvailable"
                  label="Return available"
                />
              </div>
              <div className="mb-3">
                <CFormCheck
                  checked={productForm.isReplaceable}
                  onChange={checkboxHandler}
                  name="isReplaceable"
                  id="isReplaceable"
                  label="Exchange/Replace available"
                />
              </div>
              <div className="mb-3">
                <CFormCheck
                  checked={productForm.CODAvailable}
                  onChange={checkboxHandler}
                  name="CODAvailable"
                  id="CODAvailable"
                  label="Cash on Delivery Available"
                />
              </div>
              <div className="mb-3">
                <CFormCheck
                  checked={productForm.preOrderBookingAvailable}
                  onChange={checkboxHandler}
                  name="preOrderBookingAvailable"
                  id="preOrderBookingAvailable"
                  label="Pre Order Booking  available"
                />
              </div>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Status</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm={12} lg={4} xs={12} md={4}>
                <CFormSelect
                  value={productForm.status}
                  name="status"
                  id="status"
                  aria-label="status"
                  onChange={handleInputChange}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DRAFT">DRAFT</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <div>
        <CButton color="primary" type="button" onClick={onSubmitHandler}>
          Create Product
        </CButton>
      </div>
    </CRow>
  )
}

export default CreateProduct
