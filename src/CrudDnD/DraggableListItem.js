import React, { useState, useRef, memo, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button, Row, Col } from "antd";
import { PlusCircleTwoTone } from "@ant-design/icons";
import ShadowItem from "./ShadowItem";
import { useTranslate } from "lib/MrTranslate/MrTranslate";
import { showConfirmModal } from "../Segment/UIHelper";
import DragElement from "./DragElement.js";
import { sortBy } from "lodash";
const ItemTypes = {
  tagType: "tag",
};

const DraggableListItem = (props) => {
  console.log("sdfh DraggableListItem props ===>", props);
  const {
    item,
    items,
    handleDragItemAndDrop,
    addItem,
    addChildrenItem,
    handleEditItem,
    deleteItem,
    itemIndex,
    itemSiblings,
    isCollapseAll,
    level,
  } = props;
  const { id, parent_id, label, type_c, relations, has_children } = item;
  const mrIntl = useTranslate();
  const [dropPosition, setDropPosition] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showChildren, setShowChildren] = useState(true);

  const relatedList = items.filter((listItem) => listItem.parent_id == item.id);
  const sortedRelatedList = sortBy(relatedList, "position");
  const itemSiblingsCount = itemSiblings.length;

  useEffect(() => {
    console.log("isCollapseAll on useEffect", isCollapseAll, showChildren);

    if (item.parent_type_c === "content_area") {
      setShowChildren(!isCollapseAll);
    }
  }, [isCollapseAll]);

  useEffect(() => {
    setIsHovering(false);
  }, [isEditing]);

  const dragRef = useRef(null);
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.tagType,
    item: {
      draggedItem: item,
      siblings: itemSiblings,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.tagType,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: (itemInfo, monitor) => {
      console.log("dropped item ===>", itemInfo);
      let draggedItem = itemInfo.draggedItem;
      let draggedItemSiblings = itemInfo.siblings;
      let nextPositionForChild = haveChildren
        ? sortedRelatedList[0].position
        : null;
      if (
        (!has_children && draggedItem.parent_id != parent_id) ||
        dropPosition == "addChild"
      ) {
        showConfirmModal({
          title: "Confirm drop?",
          okType: "primary",
          okText: mrIntl("CommonText.yes"),
          cancelText: mrIntl("CommonText.no"),
          // okButtonProps: {style: {backgroundColor: 'red'}},
          onOk: () =>
            handleDragItemAndDrop(
              item,
              draggedItem,
              dropPosition,
              nextPositionForChild,
              itemIndex,
              itemSiblings,
              draggedItemSiblings
            ),
          mrIntl: mrIntl,
        });
      } else {
        handleDragItemAndDrop(
          item,
          draggedItem,
          dropPosition,
          nextPositionForChild,
          itemIndex,
          itemSiblings,
          draggedItemSiblings
        );
      }
    },
    hover: (draggedItem, monitor) => {
      console.log("ref====>", dragRef);
      if (!dragRef.current) {
        return;
      }

      const hoveredItemDimensions = dragRef.current.getBoundingClientRect();
      const dragPointerDimensions = monitor.getClientOffset();

      const hoveredItemMiddleY =
        (hoveredItemDimensions.bottom - hoveredItemDimensions.top) / 2;
      const hoveredItemfourthX =
        (hoveredItemDimensions.right - hoveredItemDimensions.left) / 4;

      const dragPointerY = dragPointerDimensions.y - hoveredItemDimensions.top;
      const dragPointerX = dragPointerDimensions.x - hoveredItemDimensions.left;

      if (draggedItem.id !== id && isOver) {
        if (
          dragPointerDimensions.y > hoveredItemDimensions.top &&
          dragPointerY < hoveredItemMiddleY
        ) {
          if (dropPosition != "addBefore") {
            setDropPosition((value) => "addBefore");
          }
        } else if (dragPointerX > hoveredItemfourthX && level != 4) {
          if (dropPosition != "addChild") {
            setDropPosition((value) => "addChild");
          }
        } else if (
          dragPointerDimensions.y > hoveredItemDimensions.top &&
          dragPointerY > hoveredItemMiddleY
        ) {
          if (dropPosition != "addAfter") {
            setDropPosition((value) => "addAfter");
          }
        }
        console.log("aq dropPosition", dropPosition);
      }
    },
  });
  console.log("isitDragging", isDragging);

  const showError = item.label === "";
  const haveChildren = sortedRelatedList.length > 0;

  const handleMouseEnter = () => {
    if (!isOver && !isEditing) {
      setIsHovering(true);
    }
  };
  const handleMouseLeave = () => {
    if (!isOver && !isEditing) {
      setIsHovering(false);
    }
  };

  return (
    <div
      className={
        (isDragging ? "hidden " : "") + "draggable-list-item-container"
      }
    >
      <div className="drop-cointainer" ref={(node) => drop(node)}>
        <div
          className={(isDragging ? "blur " : "") + "element-contiainer"}
          ref={dragRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Row>
            {isOver && dropPosition == "addBefore" && (
              <ShadowItem dropPosition={dropPosition} />
            )}
          </Row>
          {/* <Row className="button-row">
          <Col offset={11}>
            {
              !isOver && isHovering && 
              <Button
                className="add-element-button m-b-5"
                icon={<PlusCircleTwoTone />}
                onClick={() => addItem("before")}
              />
            }
          </Col>
          </Row> */}
          <Row className="element-row">
            {!isOver && isHovering && (
              <Button
                key={`add-sibling-top-${item.id}`}
                type={"text"}
                size={"small"}
                className="add-element-button-above m-b-5"
                icon={<PlusCircleTwoTone />}
                onClick={() =>
                  addItem(item, "before", itemIndex, itemSiblings)
                }
              />
            )}

            <DragElement
              drop={drop}
              preview={preview}
              isDragging={isDragging}
              drag={drag}
              item={item}
              handleEditItem={handleEditItem}
              addItem={addItem}
              addChildrenItem={addChildrenItem}
              deleteItem={deleteItem}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              showAddChildrenButton={!item.has_children && level != 4}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              showChildren={showChildren}
              setShowChildren={setShowChildren}
              showCollapseButton={haveChildren}
              itemSiblingsCount={itemSiblingsCount}
            />
            {!isOver && isHovering && (
              <Button
                key={`add-sibling-bottom-${item.id}`}
                type={"text"}
                size={"small"}
                className="add-element-button-below m-t-5"
                icon={<PlusCircleTwoTone />}
                onClick={() =>
                  addItem(item, "after", itemIndex, itemSiblings)
                }
              />
            )}
          </Row>
          {/* <Row>{showError && <span className="erro-massage">required</span>}</Row> */}
          <Row className="button-row ">
            {showError && (
              <Col span={8} offset={0.5}>
                <span className="erro-massage">required</span>
              </Col>
            )}
            <Col offset={showError ? 3 : 11}>
              {/* {
                !isOver && isHovering && 
                <Button
                  className="add-element-button m-t-5"
                  icon={<PlusCircleTwoTone />}
                  onClick={() => addItem("after")}
                />
              } */}
            </Col>
          </Row>
          <Row>
            {isOver &&
              (dropPosition == "addAfter" || dropPosition == "addChild") && (
                <ShadowItem dropPosition={dropPosition} />
              )}
          </Row>
        </div>
      </div>
      {showChildren && (
        <div style={{ marginLeft: "40px" }}>
          {sortedRelatedList.map((item, index) => (
            <DraggableListItem
              key={`${item.type_c}-${item.id}`}
              item={item}
              itemIndex={index}
              itemSiblings={sortedRelatedList}
              items={items}
              handleDragItemAndDrop={handleDragItemAndDrop}
              addItem={addItem}
              addChildrenItem={addChildrenItem}
              handleEditItem={handleEditItem}
              deleteItem={deleteItem}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(DraggableListItem);
