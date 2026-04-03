import React, { useEffect, useRef } from "react";
import nbaCardsData from "../data/nbaCardsData";

const NBATablePage = () => {
  const tableRef = useRef(null);
  const tabulatorRef = useRef(null);

  useEffect(() => {
    const loadTabulator = () => {
      return new Promise((resolve) => {
        if (window.Tabulator) { resolve(); return; }
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/tabulator-tables@5.5.0/dist/css/tabulator.min.css";
        document.head.appendChild(link);
        const script = document.createElement("script");
        script.src = "https://unpkg.com/tabulator-tables@5.5.0/dist/js/tabulator.min.js";
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    const initTable = async () => {
      await loadTabulator();
      if (!window.Tabulator || !tableRef.current) return;
      if (tabulatorRef.current) tabulatorRef.current.destroy();

      // Currency formatter
      const currencyFormatter = (cell) => {
        const val = cell.getValue();
        return `<span style="color:#f5a623;font-weight:600">$${Number(val).toLocaleString()}</span>`;
      };

      // Grade badge: green PSA10, grey Raw
      const gradeFormatter = (cell) => {
        const grade = cell.getValue();
        const isRaw = grade === 0;
        if (isRaw) {
          return `<span style="background:#555;color:#fff;border-radius:4px;padding:2px 8px;font-size:11px;font-weight:bold">Raw</span>`;
        }
        const color = grade >= 10 ? "#27ae60" : grade >= 9 ? "#f39c12" : "#888";
        return `<span style="background:${color}22;color:${color};border:1px solid ${color};border-radius:4px;padding:2px 8px;font-weight:bold;font-size:12px">PSA ${grade}</span>`;
      };

      // Status tag
      const statusFormatter = (cell) => {
        const status = cell.getValue();
        const colors = { "PSA 10": "#27ae60", "PSA 9": "#f39c12", "Raw": "#555" };
        const color = colors[status] || "#888";
        return `<span style="background:${color}22;color:${color};border:1px solid ${color};border-radius:12px;padding:2px 10px;font-size:11px;font-weight:600">${status}</span>`;
      };

      // Round avatar image
      const avatarFormatter = (cell) => {
        const url = cell.getValue();
        if (!url) return "";
        return `<img src="${url}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #f5a623" onerror="this.style.display='none'" />`;
      };

      // Bold title
      const titleFormatter = (cell) => {
        const title = cell.getValue();
        const isRookie = cell.getRow().getData().rookieCard;
        const rcStyle = isRookie ? "color:#f5a623;font-weight:700" : "color:#ccc;font-weight:600";
        return `<span style="${rcStyle}">${title}</span>`;
      };

      // Rookie highlight row
      const rowFormatter = (row) => {
        if (row.getData().rookieCard) {
          row.getElement().style.backgroundColor = "rgba(245,166,35,0.08)";
          row.getElement().style.borderLeft = "3px solid #f5a623";
        }
      };

      const table = new window.Tabulator(tableRef.current, {
        data: nbaCardsData,
        layout: "fitDataFill",
        pagination: true,
        paginationSize: 20,
        paginationSizeSelector: [10, 20, 50],
        movableColumns: true,
        paginationCounter: "rows",

        columnDefaults: {
          headerFilter: true,
          headerSort: true,
        },

        columns: [
          {
            title: "",
            field: "imageUrl",
            width: 70,
            formatter: avatarFormatter,
            headerSort: false,
            headerFilter: false,
          },
          {
            title: "Card Title",
            field: "cardTitle",
            width: 300,
            formatter: titleFormatter,
            headerFilter: "input",
            headerSort: true,
          },
          {
            title: "Team",
            field: "team",
            width: 200,
            headerFilter: "list",
          },
          {
            title: "PSA Grade",
            field: "psaGrade",
            width: 110,
            formatter: gradeFormatter,
            headerSort: true,
            sorter: "number",
            headerFilter: "list",
            headerFilterParams: { values: { "10": "PSA 10", "9": "PSA 9", "0": "Raw" } },
          },
          {
            title: "Value",
            field: "gradedValue",
            width: 140,
            formatter: currencyFormatter,
            headerSort: true,
            sorter: "number",
          },
          {
            title: "Status",
            field: "status",
            width: 110,
            formatter: statusFormatter,
            headerSort: true,
            headerFilter: "list",
          },
          {
            title: "Rookie",
            field: "rookieCard",
            width: 80,
            formatter: (cell) => cell.getValue() ? "RC" : "",
            headerSort: true,
            headerFilter: true,
          },
        ],

        rowFormatter,
      });

      tabulatorRef.current = table;
    };

    initTable();
  }, []);

  return (
    <div style={{ padding: "24px", background: "#0a0a1a", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#f5a623", margin: 0, fontFamily: "Arial, sans-serif" }}>
          NBA Card Collection — Pro Dashboard
        </h2>
        <div style={{ color: "#888", fontSize: "13px", fontFamily: "Arial, sans-serif" }}>
          Total: {nbaCardsData.length} cards
        </div>
      </div>

      <div ref={tableRef} style={{ borderRadius: "8px", overflow: "hidden" }} />

      <style>{`
        .tabulator .tabulator-header { background-color: #0d1b3e !important; color: #f5a623 !important; border-bottom: 2px solid #f5a623 !important; font-family: Arial, sans-serif; font-weight: 700; }
        .tabulator .tabulator-header .tabulator-col { background-color: #0d1b3e !important; border-right: 1px solid #1a2d5a !important; }
        .tabulator .tabulator-header .tabulator-col .tabulator-col-title { color: #f5a623 !important; }
        .tabulator .tabulator-header .tabulator-header-filter input { background: #1a2d5a; color: #fff; border: 1px solid #f5a623; border-radius: 4px; }
        .tabulator .tabulator-header .tabulator-header-filter select { background: #1a2d5a; color: #fff; border: 1px solid #f5a623; }
        .tabulator .tabulator-table { background: #0d1b3e !important; color: #e0e0e0 !important; font-family: Arial, sans-serif; }
        .tabulator .tabulator-row { background: #0f1f3d !important; border-bottom: 1px solid #1a2d5a !important; }
        .tabulator .tabulator-row:hover { background: #162447 !important; }
        .tabulator .tabulator-row .tabulator-cell { border-right: 1px solid #1a2d5a !important; padding: 8px 12px !important; vertical-align: middle; }
        .tabulator .tabulator-footer { background: #0d1b3e !important; color: #888 !important; border-top: 2px solid #f5a623 !important; }
        .tabulator .tabulator-page { color: #f5a623 !important; }
        .tabulator .tabulator-page.active { background: #f5a623 !important; color: #0d1b3e !important; font-weight: bold; }
        .tabulator .tabulator-page:hover { background: #e09515 !important; color: #0d1b3e !important; }
        .tabulator .tabulator-paginator > label { color: #888 !important; }
        .tabulator .tabulator-paginator > label > select { background: #1a2d5a !important; color: #fff !important; border: 1px solid #f5a623 !important; }
        .tabulator .tabulator-paginator { display: flex !important; gap: 8px !important; align-items: center !important; padding: 8px !important; }
        .tabulator .tabulator-tooltip { background: #1a2d5a !important; color: #fff !important; border: 1px solid #f5a623 !important; border-radius: 4px !important; }
      `}</style>
    </div>
  );
};

export default NBATablePage;
