import copy from "copy-to-clipboard";
import { Button, Icon, notify } from "design-react-kit";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import isSafari from "../is-safari";
import { useYamlStore } from "../lib/store";
import UploadPanel from "./UploadPanel";

const download = (data: string) => {
  //has dom
  if (!data || data.length == 0) {
    return;
  }
  const blob = new Blob([data], {
    type: "text/yaml;charset=utf-8;",
  });
  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement("a");
  tempLink.style.cssText = "display:none";
  tempLink.download = "publiccode.yml";
  tempLink.href = blobURL;
  tempLink.setAttribute("download", "publiccode.yml");
  document.body.appendChild(tempLink);

  if (isSafari()) {
    setTimeout(() => tempLink.click());
  } else {
    tempLink.click();
  }

  setTimeout(function () {
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }, 1000);
};

const YamlPreview = (): JSX.Element => {
  const { t } = useTranslation();
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const { yaml } = useYamlStore();
  const hasYaml = typeof yaml === "string" && yaml.trim().length > 0;

  return (
    <div className="preview">
      <div className="preview__title">{"File YAML"}</div>
      <div className="preview__body">
        {!hasYaml && (
          <div className="preview__info">{t("editor.nocodegenerated")}</div>
        )}
        <div className="preview__code">
          <pre>
            <code>
              {"\n"}
              {hasYaml ? yaml : ""}
            </code>
          </pre>
        </div>
      </div>
      <div className="preview__footer">
        {showUploadPanel && (
          <UploadPanel onBack={() => setShowUploadPanel(false)} />
        )}
        <div>
          <Button
            type="button"
            disabled={!hasYaml}
            className={`d-flex gap-1 justify-content-center align-items-center ${
              showUploadPanel ? "d-none" : ""
            }`}
            onClick={() => {
              if (!hasYaml) {
                return;
              }
              copy(yaml);
              notify(t("editor.copytext"), { state: "info" });
            }}
          >
            <Icon color="white" icon="it-copy" size="sm" />
            <span className="action">{t("editor.copy")}</span>
          </Button>
        </div>
        <div>
          <Button
            type="button"
            className="d-flex gap-1 justify-content-center align-items-center"
            onClick={(e) => {
              e.preventDefault();
              setShowUploadPanel(true);
            }}
          >
            <Icon color="white" icon="it-upload" size="sm" />
            <span className="action">{t("editor.upload.upload")}</span>
          </Button>
        </div>
        <div>
          <Button
            type="button"
            disabled={!hasYaml}
            className={`d-flex gap-1 justify-content-center align-items-center ${
              showUploadPanel ? "d-none" : ""
            }`}
            onClick={() => {
              if (!hasYaml) {
                return;
              }
              download(yaml);
            }}
          >
            <Icon color="white" icon="it-download" size="sm" />
            <span className="action">{t("editor.download")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default YamlPreview;
