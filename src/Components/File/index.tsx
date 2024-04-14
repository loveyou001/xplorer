import React, { MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import GridFile from "./GridFile";
import DetailFile from "./DetailFile";

import { getStandardPath } from "../../Helpers/paths";
import { openFileRequest, openFilePreview } from "../../Store/ActionCreators/FilesActionCreators";
import { setActiveTab, updateTab } from "../../Store/ActionCreators/TabActionCreators";
import { IAppState } from "../../Store/Reducers";
import FileMetaData from "../../Typings/fileMetaData";
import { updateSelection } from "../../Store/ActionCreators/SelectionActionCreators";

export type FileDisplayMode = "GridLarge" | "GridMedium" | "GridSmall" | "Detail";

export interface IFileProps {
    mode: FileDisplayMode;
    metadata: FileMetaData;
}

export const File = ({ mode, metadata }: IFileProps): JSX.Element => {
    const dispatch = useDispatch();
    const activeTab = useSelector<IAppState, IAppState["tabs"]["activeTab"]>((state) => state.tabs.activeTab);

    const handleFileSingleClick = (filePath: string) => {
        dispatch(updateSelection({ selected: [filePath] }));
    };

    const handleFileRightClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, path: string) => {
        e.preventDefault();
        dispatch(openFilePreview(path));
    };

    const handleFileDoubleClick = (isDir: boolean, filePath: string) => {
        if (!isDir) {
            dispatch(openFileRequest(filePath));
            return;
        }

        dispatch(
            updateTab(activeTab.name, {
                ...activeTab,
                path: getStandardPath(filePath),
                name: filePath.split("\\").pop() || "",
            }),
        );
        dispatch(setActiveTab({ name: filePath.split("\\").pop() || "", path: getStandardPath(filePath), id: activeTab.id }));
    };

    switch (mode) {
        case "GridLarge":
            return (
                <GridFile
                    size={96}
                    metadata={metadata}
                    handleFileRightClick={handleFileRightClick}
                    handleFileDoubleClick={handleFileDoubleClick}
                    handleFileSingleClick={handleFileSingleClick}
                />
            );
        case "GridMedium":
            return (
                <GridFile
                    size={72}
                    metadata={metadata}
                    handleFileRightClick={handleFileRightClick}
                    handleFileDoubleClick={handleFileDoubleClick}
                    handleFileSingleClick={handleFileSingleClick}
                />
            );
        case "GridSmall":
            return (
                <GridFile
                    size={48}
                    metadata={metadata}
                    handleFileRightClick={handleFileRightClick}
                    handleFileDoubleClick={handleFileDoubleClick}
                    handleFileSingleClick={handleFileSingleClick}
                />
            );
        case "Detail":
            return (
                <DetailFile
                    metadata={metadata}
                    handleFileRightClick={handleFileRightClick}
                    handleFileDoubleClick={handleFileDoubleClick}
                    handleFileSingleClick={handleFileSingleClick}
                />
            );
        default:
            return <div>File mode not supported</div>;
    }
};

export default File;
