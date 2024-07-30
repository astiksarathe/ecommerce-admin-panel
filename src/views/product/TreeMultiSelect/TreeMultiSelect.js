import React from 'react'
import { TreeSelect } from 'antd'
const { SHOW_PARENT } = TreeSelect
import PropTypes from 'prop-types'
const TreeMultiSelect = ({ treeData, value, changeCategory, onLoadData }) => {
  const onChange = (newValue, labelList, extra) => {
    console.log('onChange ', { newValue, labelList, extra })
    changeCategory(newValue)
  }

  return (
    <TreeSelect
      treeDataSimpleMode
      style={{
        width: '100%',
      }}
      value={value}
      dropdownStyle={{
        maxHeight: 400,
        overflow: 'auto',
      }}
      allowClear
      multiple
      placeholder="Please select"
      onChange={onChange}
      loadData={onLoadData}
      treeData={treeData}
    />
  )
}

export default TreeMultiSelect

TreeMultiSelect.propTypes = {
  changeCategory: PropTypes.func.isRequired,
  onLoadData: PropTypes.func.isRequired,
  treeData: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
}
