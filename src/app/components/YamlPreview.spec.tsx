import React from "react";
import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import copy from "copy-to-clipboard";
import { notify } from "design-react-kit";
import YamlPreview from "./YamlPreview";
import { useYamlStore } from "../lib/store";

jest.mock("copy-to-clipboard", () => jest.fn());

jest.mock("design-react-kit", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Icon: () => <span aria-hidden="true" />,
  notify: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "editor.copy": "Copy to clipboard",
        "editor.copytext": "Copied to clipboard",
        "editor.download": "Download",
        "editor.upload.upload": "Upload",
        "editor.nocodegenerated": "No code generated",
      };
      return translations[key] ?? key;
    },
  }),
}));

jest.mock("../lib/store", () => ({
  useYamlStore: jest.fn(),
}));

jest.mock("./UploadPanel", () => ({
  __esModule: true,
  default: () => null,
}));

const mockedUseYamlStore = useYamlStore as jest.Mock;

describe("YamlPreview", () => {
  let container: HTMLDivElement;
  let root: Root;

  const renderComponent = (yaml: string | undefined) => {
    mockedUseYamlStore.mockReturnValue({ yaml });

    act(() => {
      root.render(<YamlPreview />);
    });
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    jest.clearAllMocks();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    document.body.removeChild(container);
  });

  test("disables copy and download when yaml is empty", () => {
    renderComponent(undefined);

    const copyButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Copy to clipboard"),
    );
    const downloadButton = Array.from(
      container.querySelectorAll("button"),
    ).find((button) => button.textContent?.includes("Download"));

    expect(copyButton).toBeDefined();
    expect(downloadButton).toBeDefined();
    expect(copyButton).toHaveProperty("disabled", true);
    expect(downloadButton).toHaveProperty("disabled", true);
  });

  test("enables copy and download when yaml has content", () => {
    renderComponent("name: test-project");

    const copyButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Copy to clipboard"),
    );
    const downloadButton = Array.from(
      container.querySelectorAll("button"),
    ).find((button) => button.textContent?.includes("Download"));

    expect(copyButton).toBeDefined();
    expect(downloadButton).toBeDefined();
    expect(copyButton).toHaveProperty("disabled", false);
    expect(downloadButton).toHaveProperty("disabled", false);
  });

  test("copies yaml and shows notification when copy is clicked", () => {
    renderComponent("name: test-project");

    const copyButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Copy to clipboard"),
    ) as HTMLButtonElement;

    act(() => {
      copyButton.click();
    });

    expect(copy).toHaveBeenCalledWith("name: test-project");
    expect(notify).toHaveBeenCalledWith("Copied to clipboard", {
      state: "info",
    });
  });
});