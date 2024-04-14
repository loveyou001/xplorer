import React, { useEffect } from "react";
import { ThemedDiv, ThemedSpan } from "../Theme";
import { useSelector } from "react-redux";
import { IAppState } from "../../Store/Reducers";

const Infobar = () => {
    const files = useSelector<IAppState, IAppState["files"]["files"]>((state) => state.files.files);
    const selected = useSelector<IAppState, IAppState["selection"]["selected"]>((state) => state.selection.selected);
    return (
        <ThemedDiv componentName="infobar" className="infobar">
            <ThemedDiv componentName="infobarLeft" className="infobar-left">
                <ThemedSpan componentName="infobarItem" className="infobar-item">
                    {Object.keys(files).length} Items
                </ThemedSpan>
                {selected.length > 0 ? (
                    <ThemedSpan componentName="infobarItem" className="infobar-item">
                        {selected.length} Selected
                    </ThemedSpan>
                ) : null}
            </ThemedDiv>
            <ThemedDiv componentName="infobarRight" className="infobar-right">
                <ThemedSpan componentName="infobarItem" className="infobar-item"></ThemedSpan>
            </ThemedDiv>
        </ThemedDiv>
    );
};

export default Infobar;
