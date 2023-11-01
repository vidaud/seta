import { css } from '@emotion/react'

import { minSlideFade } from '~/styles/keyframe-animations'

export const tree: ThemedCSS = theme => css`
  border: none;
  padding: 0;

  .p-tree-toggler,
  .p-treenode-icon {
    color: ${theme.colors.dark[3]} !important;
  }

  .p-tree-toggler-icon {
    font-size: 13px;
    margin-left: 2px;
  }

  .p-treenode-content[aria-expanded='true'] .p-tree-toggler-icon {
    margin-top: 2px;
  }

  .p-checkbox .p-checkbox-box.p-highlight,
  .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover {
    background: ${theme.colors.teal[6]};
    border-color: ${theme.colors.teal[6]};
  }

  .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box:hover {
    border-color: ${theme.colors.teal[7]};
  }

  .p-tree-container .p-treenode {
    padding: 0;

    &:first-of-type {
      padding-top: 0.3rem;
    }

    &:not(:last-of-type) {
      padding-bottom: 0.3rem;
    }
  }

  .p-treenode-children {
    animation: ${minSlideFade} 0.2s ease-in-out;
  }

  .p-tree-container .p-treenode .p-treenode-content {
    padding: 0.3rem;
    border: 1px solid transparent;
    border-radius: ${theme.radius.sm};

    transition: background-color 0.2s ${theme.transitionTimingFunction},
      border-color 0.2s ${theme.transitionTimingFunction};

    &:active {
      transform: translateY(1px);
    }
  }

  .p-tree-container .p-treenode .p-treenode-content:focus,
  .p-tree-container .p-treenode .p-treenode-content .p-tree-toggler:focus {
    box-shadow: none;
  }

  .p-tree-container .p-treenode .p-treenode-content.p-highlight {
    background: ${theme.colors.gray[0]};
    border: 1px dashed ${theme.colors.gray[3]};
    color: ${theme.colors.dark[5]};
    font-weight: 500;
  }

  .p-tree-container .p-treenode .p-treenode-content.p-treenode-selectable:not(.p-highlight):hover {
    background: ${theme.colors.gray[1]};
    color: ${theme.colors.dark[5]};
  }

  .p-tree-container .p-treenode .p-treenode-content .p-tree-toggler {
    width: 1.5rem;
    height: 1.5rem;
  }

  .p-checkbox {
    align-items: center;
  }

  .p-checkbox .p-checkbox-box {
    width: 20px;
    height: 20px;
    border-radius: ${theme.radius.sm};

    .p-checkbox-icon {
      font-size: 0;
      background: white;
      color: transparent !important;
      border-radius: ${theme.radius.xs};
      width: 10px;
      height: 10px;
    }

    &.p-indeterminate {
      .p-checkbox-icon {
        background: ${theme.colors.dark[3]};
        width: 12px;
        height: 3px;
      }
    }
  }
`
