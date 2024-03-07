import { Button, Input, Space } from "antd";
import React, { memo, useState, useEffect } from "react";
import {
  DragOutlined,
  MenuOutlined,
  CaretDownFilled,
  CaretRightFilled,
} from "@ant-design/icons";
import ActionButtons from "./ActionButtons";
import InfoElement from "./InfoElement";
const { TextArea } = Input;

const DragElement = (props) => {
  const {
    preview,
    isDragging,
    drag,
    item,
    handleEditItem,
    deleteItem,
    // addItem,
    addChildrenItem,
    handleMouseEnter,
    handleMouseLeave,
    showAddChildrenButton,
    isEditing,
    setIsEditing,
    showChildren,
    setShowChildren,
    showCollapseButton,
    itemSiblingsCount,
  } = props;
  const { id, label } = item;
  const [tagName, setTagName] = useState(label);

  useEffect(() => {
    setTagName(label);
  }, [label]);

  const handleTagName = (inputValue) => {
    setTagName(inputValue);
    handleEditItem(inputValue, id);
  };

  return (
    <div
      className={`element ${isDragging ? "blur" : ""}`}
      ref={(node) => {
        preview(node);
      }}
    >
      <Space>
        {showCollapseButton &&
          (showChildren ? (
            <CaretDownFilled onClick={() => setShowChildren(false)} />
          ) : (
            <CaretRightFilled onClick={() => setShowChildren(true)} />
          ))}
        <MenuOutlined ref={(node) => drag(node)} className="drag-icon" />
        <TextArea
          key={`textarea-${item.id}`}
          autoSize
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          id={id}
          value={tagName}
          className={
            // "element-text-input" + (!showCollapseButton ? " m-l-15" : "")
            "element-text-input"
          }
          onChange={(e) => handleTagName(e.target.value)}
          placeholder="Enter value"
        />
        {process.env.REACT_APP_MODE === "staging" && (
          <InfoElement item={item} />
        )}
        <ActionButtons
          // addItem = {addItem}
          addChildrenItem={addChildrenItem}
          deleteItem={deleteItem}
          // showAddButton = {false}
          showAddChildrenButton={showAddChildrenButton}
          showDeleteButton={true}
          item={item}
          itemSiblingsCount={itemSiblingsCount}
        />
      </Space>
    </div>
  );
};

export default memo(DragElement);
