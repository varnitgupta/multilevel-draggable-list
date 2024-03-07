import React, { useState, memo, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableListItem from "./DraggableListItem";
import "./DraggableList.scss";
import { Button, Tooltip } from "antd";
import { sortBy } from "lodash";

const DraggableList = (props) => {
  console.log("eaqmsd DraggableList props", props);

  const {
    items,
    handleDragItemAndDrop,
    addItem,
    addChildrenItem,
    handleEditItem,
    deleteItem,
    handleAddNewItem,
  } = props;
  const [isCollapseAll, setIsCollapseAll] = useState(true);

  let relatedList = items.filter(
    (item) => item.parent_type_c === "content_area"
  );
  let sortedRelatedList = sortBy(relatedList, "position");

  console.log("DraggableList finalJson", {
    sortedRelatedList,
    items,
  });

  return (
    <DndProvider backend={HTML5Backend}>
      {relatedList.length == 0 && (
        <Button onClick={() => handleAddNewItem()}>+ Add</Button>
      )}
      {relatedList.length > 0 && (
        <Button onClick={() => setIsCollapseAll(!isCollapseAll)}>
          {(isCollapseAll ? "Uncollapse" : "Collapse") + " all"}
        </Button>
      )}
        <div
          className="draggable-list-crud-container"
        >
          {sortedRelatedList.map((item, index) => (
            <DraggableListItem
              key={`${item.type_c}-${item.id}`}
              item={item}
              itemIndex={index}
              itemSiblings={sortedRelatedList}
              items={items}
              isCollapseAll={isCollapseAll}
              handleDragItemAndDrop={handleDragItemAndDrop}
              addChildrenItem={addChildrenItem}
              addItem={addItem}
              handleEditItem={handleEditItem}
              deleteItem={deleteItem}
              level={1}
            />
          ))}
        </div>
    </DndProvider>
  );
};

export default memo(DraggableList);
