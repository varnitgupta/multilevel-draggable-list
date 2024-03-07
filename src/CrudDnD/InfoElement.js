import React, { memo } from "react";
import { Tag, Tooltip } from "antd";
import { useTranslate } from "lib/MrTranslate/MrTranslate";

const InfoElement = (props) => {
  const { item } = props;
  const mrIntl = useTranslate();
  let gradeList = [];

  if (item.relations) {
    item.relations.forEach((relation) => {
      gradeList.push(
        <Tooltip title="grade">
          <Tag key={`${relation.label}-${item.id}`}>{relation.label}</Tag>
        </Tooltip>
      );
    });
  }

  return (
    <>
      {gradeList}
      <Tooltip title="id">
        <Tag>{item.id}</Tag>
      </Tooltip>
      <Tooltip title="position">
        <Tag>{item.position}</Tag>
      </Tooltip>
      <Tooltip title="type_c">
        <Tag>{item.type_c}</Tag>
      </Tooltip>
      <Tooltip title="parent_type_c">
        <Tag>{item.parent_type_c}</Tag>
      </Tooltip>
      <Tooltip title="has_children">
        <Tag>{item.has_children ? "true" : "false"}</Tag>
      </Tooltip>
      <Tooltip title="parent_id">
        <Tag>{item.parent_id || "NPI"}</Tag>
      </Tooltip>
    </>
  );
};

export default memo(InfoElement);
