import React, { useState, useCallback } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  Check,
} from "lucide-react";

export interface ITreeNode {
  id: string;
  label: string;
  children?: ITreeNode[];
}

export type SelectionMode = "single" | "multi";
type CheckedState = "checked" | "unchecked" | "indeterminate";

interface TreeCheckboxProps {
  data: any[];
  idKey?: string;
  labelKey?: string;
  defaultMode?: SelectionMode;
  defaultExpanded?: string[];
  selected?: string[];
  onChange?: (selectedIds: string[]) => void;
}

function getLeafIds(node: ITreeNode): string[] {
  if (!node.children || node.children.length === 0) return [node.id];
  return node.children.flatMap(getLeafIds);
}

function getCheckedState(node: ITreeNode, selected: Set<string>): CheckedState {
  const leaves = getLeafIds(node);
  if (leaves.length === 0)
    return selected.has(node.id) ? "checked" : "unchecked";
  const checkedCount = leaves.filter((id) => selected.has(id)).length;
  if (checkedCount === 0) return "unchecked";
  if (checkedCount === leaves.length) return "checked";
  return "indeterminate";
}

function normalizeNode(node: any, idKey: string, labelKey: string): ITreeNode {
  return {
    id: node[idKey],
    label: node[labelKey],
    children: node.children?.map((child: any) =>
      normalizeNode(child, idKey, labelKey),
    ),
  };
}

function normalizeTree(
  data: any[],
  idKey: string,
  labelKey: string,
): ITreeNode[] {
  return data?.map((node) => normalizeNode(node, idKey, labelKey));
}

interface TreeNodeProps {
  node: ITreeNode;
  depth: number;
  selected: Set<string>;
  onToggle: (node: ITreeNode) => void;
  mode: SelectionMode;
  expanded: Set<string>;
  onExpand: (id: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  depth,
  selected,
  onToggle,
  mode,
  expanded,
  onExpand,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded.has(node.id);

  const checkedState: CheckedState = hasChildren
    ? getCheckedState(node, selected)
    : selected.has(node.id)
      ? "checked"
      : "unchecked";

  const isSelected = checkedState === "checked";
  const isIndeterminate = checkedState === "indeterminate";

  return (
    <div className="select-none">
      <div
        className={`group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all duration-150 ${
          isSelected
            ? "bg-violet-50 dark:bg-violet-950/30"
            : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
        }`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(node);
        }}
      >
        <span
          className={`flex-shrink-0 w-4 h-4 flex items-center justify-center text-zinc-400 transition-transform duration-200 ${
            hasChildren ? "cursor-pointer" : "opacity-0 pointer-events-none"
          }`}
          onClick={(e) => {
            if (hasChildren) {
              e.stopPropagation();
              onExpand(node.id);
            }
          }}
        >
          {hasChildren &&
            (isExpanded ? (
              <ChevronDown size={13} />
            ) : (
              <ChevronRight size={13} />
            ))}
        </span>

        <div
          className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150 ${
            mode === "multi"
              ? isSelected
                ? "bg-primary/50 border-primary/50"
                : isIndeterminate
                  ? "bg-violet-200 border-primary/50"
                  : "border-zinc-300 group-hover:border-primary/50"
              : isSelected
                ? "border-primary/50"
                : "border-zinc-300 group-hover:border-primary/50"
          }`}
        >
          {mode === "multi" && isSelected && (
            <Check size={10} className="text-white stroke-[3]" />
          )}
          {mode === "multi" && isIndeterminate && (
            <div className="w-2 h-0.5 bg-primary/50 dark:bg-primary/50 rounded" />
          )}
          {mode === "single" && isSelected && (
            <div className="w-2 h-2 rounded-full bg-primary/50" />
          )}
        </div>

        {/* <span
          className={`flex-shrink-0 transition-colors ${
            isSelected ? "text-primary/50" : "text-zinc-400"
          }`}
        >
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen size={14} />
            ) : (
              <Folder size={14} />
            )
          ) : (
            <File size={14} />
          )}
        </span> */}

        <span
          className={`text-sm font-medium transition-colors ${
            isSelected ? "text-primary" : "text-zinc-700 dark:text-zinc-300"
          }`}
        >
          {node.label}
        </span>

        {hasChildren && (
          <span className="ml-auto text-xs text-zinc-400 font-mono">
            {getLeafIds(node).length}
          </span>
        )}
      </div>

      {hasChildren && isExpanded && node.children && (
        <div className="relative">
          <div
            className="absolute top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700"
            style={{ left: `${depth * 20 + 19}px` }}
          />
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selected={selected}
              onToggle={onToggle}
              mode={mode}
              expanded={expanded}
              onExpand={onExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeCheckbox: React.FC<TreeCheckboxProps> = ({
  data,
  idKey = "id",
  labelKey = "label",
  defaultMode = "multi",
  defaultExpanded = [],
  selected: selectedProp,
  onChange,
}) => {
  const [mode] = useState<SelectionMode>(defaultMode);
  const [internalSelected, setInternalSelected] = useState<Set<string>>(
    new Set(),
  );
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(defaultExpanded),
  );

  const isControlled = !!selectedProp;
  const selected = isControlled ? new Set(selectedProp) : internalSelected;

  const treeData = normalizeTree(data, idKey, labelKey);

  const handleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleToggle = useCallback(
    (node: ITreeNode) => {
      const leaves = getLeafIds(node);
      const allSelected = leaves.every((id) => selected.has(id));

      const nextSelected = new Set(selected);
      if (mode === "single") {
        nextSelected.clear();
        if (!allSelected) nextSelected.add(node.id);
      } else {
        if (allSelected) leaves.forEach((id) => nextSelected.delete(id));
        else leaves.forEach((id) => nextSelected.add(id));
      }

      if (!isControlled) setInternalSelected(nextSelected);
      onChange?.([...nextSelected]);

      if (node.children && !expanded.has(node.id)) handleExpand(node.id);
    },
    [mode, selected, expanded, handleExpand, isControlled, onChange],
  );

  return (
    <div className="w-full">
      <div className="overflow-hidden">
        <div className=" space-y-0.5">
          {treeData?.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              selected={selected}
              onToggle={handleToggle}
              mode={mode}
              expanded={expanded}
              onExpand={handleExpand}
            />
          ))}
        </div>
      </div>
    </div>
  );
};