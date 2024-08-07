import { useEffect, useState } from "react";
import Window from "../../../components/Window/Window";
import Icon from "../../../utils/icon";
import style from "./notes.module.scss";
import { useNavigate } from "react-router-dom";
import { fetchNui } from "~utils/fetchNui";
import {
  SendErrorNotification,
  SendSuccessNotification,
} from "~utils/notifications";
import { useTranslation } from "react-i18next";

interface NoteItem {
  id: string;
  header: string;
  message: string;
  time: string;
}

interface APIResp {
  0: boolean;
  1?: string;
  2?: string;
}

const Notes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [initialNotes, setInitialNotes] = useState<NoteItem[]>([]);
  const [currentNote, setCurrentNote] = useState<NoteItem | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchNui<NoteItem[]>("fetchNotes", {}, [
      {
        id: "bd_note1",
        header: "Garreett is not Fat1",
        message: "Gay1",
        time: "1/7/2024,2:27:14 AM",
      },
      {
        id: "bd_note1",
        header: "Garreett is not Fat2",
        message: "Gay1",
        time: "1/7/2024,2:27:14 AM",
      },
      {
        id: "bd_note1",
        header: "Garreett is not Fat3",
        message: "Gay1",
        time: "1/7/2024,2:27:14 AM",
      },
    ])
      .then((data) => {
        setNotes(data);
        setInitialNotes(data);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  function saveFile() {
    if (currentNote == null) return;

    if (currentNote.header.length < 5) {
      return SendErrorNotification(t("notes.note_header"));
    }

    if (currentNote.message.length < 20) {
      return SendErrorNotification(t("notes.note_msg"));
    }

    if (currentNote.id === "newnote") {
      currentNote.time = new Date().toLocaleString();
      fetchNui<APIResp>("saveNote", currentNote).then((response) => {
        if (response[0] == true && response[1] && response[2]) {
          setNotes([
            ...notes,
            {
              ...currentNote,
              id: response[2],
            },
          ]);
          setInitialNotes([
            ...notes,
            {
              ...currentNote,
              id: response[2],
            },
          ]);
          setCurrentNote(null);
          SendSuccessNotification(response[1]);
        } else if (response[0] == false && response[1]) {
          SendErrorNotification(response[1]);
        }
      });
    } else {
      fetchNui<APIResp>("updateNote", currentNote).then((response) => {
        if (response[0] == true && response[1]) {
          setNotes(
            notes.map((note) => {
              if (note.id === currentNote.id) {
                return currentNote;
              }

              return note;
            })
          );
          setInitialNotes(
            notes.map((note) => {
              if (note.id === currentNote.id) {
                return currentNote;
              }

              return note;
            })
          );
          SendSuccessNotification(response[1]);
        } else if (response[0] == false && response[1]) {
          SendErrorNotification(response[1]);
        }
      });
    }
  }

  function deleteFile() {
    if (currentNote == null) return;

    if (currentNote.id === "newnote") {
      setCurrentNote(null);
      return;
    }

    fetchNui<APIResp>("deleteNote", currentNote).then((response) => {
      if (response[0] == true && response[1]) {
        setNotes(notes.filter((note) => note.id !== currentNote.id));
        setInitialNotes(notes.filter((note) => note.id !== currentNote.id));
        setCurrentNote(null);
        SendSuccessNotification(response[1]);
      } else if (response[0] == false && response[1]) {
        SendErrorNotification(response[1]);
      }
    });
  }

  return (
    <Window>
      <div className={style.notesApp}>
        <div className={style.notesControls}>
          <div className={style.notesSearch}>
            <input
              type="text"
              className={style.notesSearchInput}
              placeholder={t("notes.search")}
              onChange={(e) => {
                const search = e.target.value.toLowerCase();

                if (search.length === 0) {
                  setNotes(initialNotes);
                  return;
                }

                setNotes(
                  initialNotes.filter(
                    (note) =>
                      note.header.toLowerCase().includes(search) ||
                      note.message.toLowerCase().includes(search)
                  )
                );
              }}
            />
            <Icon id="search" className={style.iconSearch} />
          </div>
          <div className={style.notesCreateNameInput}>
            <input
              type="text"
              className={style.notesCreationName}
              placeholder={t("notes.untitled")}
              disabled={currentNote == null}
              value={currentNote?.header || ""}
              onChange={(e) => {
                if (currentNote == null) return;

                setCurrentNote({
                  ...currentNote,
                  header: e.target.value,
                });
              }}
            />
          </div>
          <div
            className={style.createNoteButton}
            onClick={() => {
              setCurrentNote({
                id: "newnote",
                header: t("notes.new_note"),
                message: t("notes.msg_here"),
                time: new Date().toLocaleString(),
              });
            }}
          >
            {t("notes.new_note")}
          </div>
        </div>
        <div className={style.notesContent}>
          <div className={style.notesList}>
            {notes && notes.length > 0 ? (
              notes.map((note) => (
                <div
                  className={style.noteItem}
                  key={note.id}
                  onClick={() => {
                    setCurrentNote(note);
                  }}
                >
                  <Icon id="note" className={style.iconNote} />
                  <div className={style.noteTitle}>
                    <div className={style.greenLine} />
                    <div className={style.noteHeader}>
                      {note.header.length > 26
                        ? `${note.header.substring(0, 22)} ...`
                        : note.header}
                    </div>
                  </div>
                  <div className={style.noteDate}>{note.time}</div>
                </div>
              ))
            ) : (
              <div
                style={{
                  color: "white",
                  fontSize: "24px",
                }}
              >
                {t("notes.no_notes")}
              </div>
            )}
          </div>
          <div className={style.notesEditor}>
            <textarea
              className={style.noteInput}
              placeholder="Note"
              disabled={currentNote == null}
              value={currentNote?.message || ""}
              onChange={(e) => {
                if (currentNote == null) return;

                setCurrentNote({
                  ...currentNote,
                  message: e.target.value,
                });
              }}
            />
            <div className={style.noteButtons}>
              <div className={style.noteSaveButton} onClick={saveFile}>
                {t("notes.save")}
              </div>
              <div className={style.noteDeleteButton} onClick={deleteFile}>
                {t("notes.delete")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default Notes;
