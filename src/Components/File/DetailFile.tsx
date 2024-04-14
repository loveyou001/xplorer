import React, { MouseEvent } from "react";
import FileMetaData from "../../Typings/fileMetaData";
import { ThemedButton, ThemedSpan } from "../Theme";
import { useSelector } from "react-redux";
import { IAppState } from "../../Store/Reducers";
export interface IDetailFileProps {
    metadata: FileMetaData;
    handleFileRightClick: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, path: string) => void;
    handleFileDoubleClick: (isDir: boolean, dirName: string) => void;
    handleFileSingleClick: (dirName: string) => void;
}

const DetailFile = ({ metadata, handleFileRightClick, handleFileDoubleClick, handleFileSingleClick }: IDetailFileProps): JSX.Element => {
    const selectedFiles = useSelector<IAppState, IAppState["selection"]["selected"]>((state) => state.selection.selected);

    return (
        <ThemedButton
            componentName={selectedFiles.includes(metadata.file_path) ? "fileDetailViewSelected" : "fileDetailView"}
            className="detail-view"
            onContextMenu={(e) => handleFileRightClick(e, metadata.file_path)}
            onDoubleClick={() => handleFileDoubleClick(!!metadata.is_dir, metadata.file_path)}
            onClick={() => handleFileSingleClick(metadata.file_path)}
        >
            <ThemedSpan className="file-detail-view-basename" componentName="fileDetailViewBaseName">
                {metadata.basename}
            </ThemedSpan>
            <ThemedSpan className="file-detail-view-timeline" componentName="fileDetailViewTimeline">
                {metadata.last_accessed ? new Date(metadata.last_accessed.secs_since_epoch * 1000).toDateString() : null}
            </ThemedSpan>
            <ThemedSpan className="file-detail-view-size" componentName="fileDetailViewSize">
                {metadata.size}
            </ThemedSpan>
            <ThemedSpan className="file-detail-view-filetype" componentName="fileDetailViewFileType">
                {metadata.file_type}
            </ThemedSpan>
        </ThemedButton>
    );
};

export default DetailFile;
