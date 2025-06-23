import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { get, ref, set } from "firebase/database";
import { database } from "../firebase/firebaseConfig";
import emailjs from "emailjs-com";

interface InviteModalProps {
  show: boolean;
  onClose: () => void;
  boardId: string;
}

const InviteModal: React.FC<InviteModalProps> = ({
  show,
  onClose,
  boardId,
}) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const handleInvite = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const usersRef =  ref(database, "users");
      const snapshot = await get(usersRef);
     console.log("User snapshot:", snapshot.val());

      let targetUid: string | null = null;

      snapshot.forEach((child) => {
        const user = child.val();
        if (user.email === email) {
          targetUid = child.key!;
        }
      });
      if (!targetUid) {
        setMessage({
          type: "danger",
          text: "User not found. Please ask them to register.",
        });
        setLoading(false);
        return;
      }

      // ✅ Share board
      await set(
        ref(database, `boards/${boardId}/sharedWith/${targetUid}`),
        true
      );

      const inviteLink = `${window.location.origin}/board/${boardId}`;
      await navigator.clipboard.writeText(inviteLink);
      
      //  Send email using EmailJS
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID!,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID!,
        {
          to_email: email,
          invite_link: inviteLink,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY!
      );

      setMessage({
        type: "success",
        text: "Invite sent & link copied to clipboard!",
      });
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "danger", text: "Failed to invite. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setMessage(null);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Invite to Board</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="inviteEmail">
            <Form.Label>Enter email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Form>
        {message && (
          <Alert variant={message.type} className="mt-3">
            {message.text}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleInvite}
          disabled={loading || !email}
        >
          {loading ? "Inviting..." : "Invite"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InviteModal;
