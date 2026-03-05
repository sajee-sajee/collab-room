import React, { useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';

const Editor = ({ code, setCode, language, socket, roomId }) => {
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    const handleEditorChange = (value) => {
        setCode(value);
        if (socket && roomId) {
            socket.emit('code_change', { roomId, code: value });
        }
    };

    useEffect(() => {
        if (!socket) return;

        const handleCodeUpdate = (newCode) => {
            if (newCode !== code) {
                setCode(newCode);
            }
        };

        socket.on('code_update', handleCodeUpdate);

        return () => {
            socket.off('code_update', handleCodeUpdate);
        };
    }, [socket, code, setCode]);

    return (
        <div className="w-full h-full border border-gray-800 rounded-lg overflow-hidden">
            <MonacoEditor
                height="100%"
                language={language === 'nodejs' ? 'javascript' : language}
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                    padding: { top: 16 }
                }}
            />
        </div>
    );
};

export default Editor;
