// BoardsTable.tsx
import React from "react";
import { Table, Button } from "react-bootstrap";

interface Board {
  boardId: string;
  title: string;
  createdAt: number;
  invitedFrom?: string;
}

interface Props {
  boards: Board[];
  onlineCounts: Record<string, number>;
  onRowClick: (boardId: string) => void;
  onDelete: (boardId: string) => void;
  user: any;
}

const BoardsTable: React.FC<Props> = ({
  boards,
  onlineCounts,
  onRowClick,
  onDelete,
  user,
}) => {
  return (
    <Table hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Online users</th>
          <th>Created</th>
          <th>Owner</th>
          {/* <th>Actions</th> */}
        </tr>
      </thead>
      <tbody>
        {boards.map((board) => (
          <tr key={board.boardId}>
            <td
              style={{ cursor: "pointer" }}
              onClick={() => onRowClick(board.boardId)}
            >
              📁 <strong>{board.title || board.boardId}</strong>
              <br />
              <small>
                Created {new Date(board.createdAt).toLocaleDateString()}
              </small>
            </td>
            <td>{onlineCounts[board.boardId] || 0}</td>
            <td>{new Date(board.createdAt).toLocaleDateString()}</td>
            <td>{board.invitedFrom || user?.displayName || "You"}</td>
            {/* <td>
              <Button
                size="sm"
                variant="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(board.boardId);
                }}
              >
                Delete
              </Button>
            </td> */}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default BoardsTable;
