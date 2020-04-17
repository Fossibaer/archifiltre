import React, { FC, useCallback } from "react";
import styled from "styled-components";
import BreadcrumbPoly from "./breadcrumb-poly";
import { CopyToClipboard } from "../../common/copy-to-clipboard";
import { Dims, DimsAndId } from "../icicle/icicle-rect";

const BreadcrumbWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  cursor: ${({ active }) => (active ? "pointer" : "unset")};
  opacity: ${({ active }) => (active ? 1 : 0.3)};
`;

const CopyToClipboardWrapper = styled.div`
  visibility: hidden;
  ${BreadcrumbWrapper}:hover & {
    visibility: ${({ active }) => (active ? "visible" : "hidden")};
  }
`;

const BreadcrumbPolyWrapper = styled.div`
  width: 5%;
  flex-shrink: 0;
`;

const BreadcrumbTextWrapper = styled.div`
  max-width: 90%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  flex-shrink: 1;
`;

const Spacer = styled.div`
  width: 5%;
  flex-shrink: 0;
`;

const SmallSpacer = styled.div`
  width: 0.3em;
  flex-shrink: 2;
`;

export enum BreadcrumbOpacity {
  LOCKED = 1,
  HOVERED = 0.4,
}

const emptyDims: Dims = {
  x: 0,
  dx: 0,
  y: 0,
  dy: 0,
};

/**
 * Dummy getter as we cannot know dims from the breadcrumbs
 */
const dimsGetter = (): Dims => emptyDims;

interface BreadcrumbProps {
  active: boolean;
  opacity: BreadcrumbOpacity;
  color: string;
  isFirst: boolean;
  isLast: boolean;
  name: string;
  path: string;
  id: string;
  onBreadcrumbClick: (dimsAndId: DimsAndId, event) => void;
}

const Breadcrumb: FC<BreadcrumbProps> = ({
  active,
  isFirst,
  isLast,
  opacity,
  color,
  name,
  path,
  id,
  onBreadcrumbClick,
}) => {
  const onClick = useCallback(
    (event) => {
      if (!active) {
        return;
      }
      onBreadcrumbClick({ id, dims: dimsGetter }, event);
    },
    [onBreadcrumbClick, id, active]
  );
  return (
    <BreadcrumbWrapper onClick={onClick} active={active}>
      <BreadcrumbPolyWrapper>
        <BreadcrumbPoly
          isFirst={isFirst}
          isLast={isLast}
          opacity={opacity}
          color={color}
        />
      </BreadcrumbPolyWrapper>
      <Spacer />
      <BreadcrumbTextWrapper>{name}</BreadcrumbTextWrapper>
      <SmallSpacer />
      <CopyToClipboardWrapper active={active}>
        <CopyToClipboard stringToCopy={path} />
      </CopyToClipboardWrapper>
    </BreadcrumbWrapper>
  );
};

export default Breadcrumb;