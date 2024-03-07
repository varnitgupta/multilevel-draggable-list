import React, { memo } from "react";
import {
  DragOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import { showConfirmModal } from "../Segment/UIHelper";
import { useTranslate } from "lib/MrTranslate/MrTranslate";
import { Button, Space, Tooltip } from "antd";

const ActionButtons = (props) => {
  console.log("ActionButtons props", props);

  const {
    // addItem,
    addChildrenItem,
    deleteItem,
    // showAddButton,
    showAddChildrenButton,
    showDeleteButton,
    item,
    itemSiblingsCount,
  } = props;

  const mrIntl = useTranslate();
  return (
    <Space>
      {/* {
      showAddButton && 
      (<Button
        className="add-element-button"
        icon={<PlusCircleTwoTone />}
        onClick={() => addItem(item)}
      />)
    } */}
      {showAddChildrenButton && (
        <Tooltip title="Add child">
          <Button
            key={`add-children-${item.id}`}
            className="add-children-button"
            icon={<PlusCircleOutlined />}
            // onClick={() => setShowAddChildrenInput(true)}
            onClick={() => addChildrenItem(item)}
          />
        </Tooltip>
      )}
      {showDeleteButton && (
        <Button
          key={`delete-${item.id}`}
          className="delete-button"
          icon={<DeleteOutlined />}
          onClick={() =>
            showConfirmModal({
              title: mrIntl("CommonText.confirm_delete"),
              className: "tag-delete-confirm-modal",
              icon: <DeleteOutlined style={{ color: "red" }} />,
              content: (
                <div>
                  <p>
                    <strong>{mrIntl("ExperienceList.warning")}</strong>
                  </p>
                  <p>
                    {mrIntl(
                      "ActionButtons.you_are_about_to_delete_this_tag_along_with_all"
                    )}
                    :
                    <br />
                    <br />
                    <strong>
                      {item.label}({item.type_c})
                    </strong>
                    <br />
                    <br />
                  </p>
                  <p>
                    {mrIntl(
                      "ActionButtons.you_cannot_undo_this_action_if_you_submit"
                    )}
                  </p>
                </div>
              ),
              okText: mrIntl("CommonText.delete"),
              cancelText: mrIntl("CommonText.no"),
              okButtonProps: { style: { backgroundColor: "red" } },
              onOk: () => deleteItem(item, itemSiblingsCount),
              mrIntl: mrIntl,
            })
          }
        />
      )}
    </Space>
  );
};

export default memo(ActionButtons);
