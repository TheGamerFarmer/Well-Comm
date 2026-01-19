export function CalendarStyles() {
    const styles = `
        .fc .fc-button-primary {
            background-color: #0551ab !important;
            border-color: #0551ab !important;
            color: #ffffff !important;
            text-transform: capitalize;
            font-weight: bold;
            border-radius: 8px;
            padding: 0.4em 0.65em;
            font-size: 0.9em;
        }

        @media (max-width: 640px) {
            .fc .fc-button-primary {
                padding: 0.3em 0.4em;
                font-size: 0.7em;
                border-radius: 6px;
            }
            
            .fc .fc-toolbar-chunk {
                display: flex;
                gap: 2px;
            }
        }

        @media (max-width: 480px) {
            .fc .fc-button-primary {
                padding: 0.25em 0.3em;
                font-size: 0.65em;
                border-radius: 4px;
            }
        }

        .fc .fc-button-primary:not(:disabled):hover {
            background-color: #ffffff !important;
            color: #0551ab !important;
        }

        .fc-toolbar-title {
            color: #000000 !important;
            font-weight: bold !important;
            font-size: 1.5em !important;
        }

        @media (max-width: 640px) {
            .fc-toolbar-title {
                font-size: 1em !important;
            }
        }

        @media (max-width: 480px) {
            .fc-toolbar-title {
                font-size: 0.85em !important;
            }
        }

        .fc .fc-toolbar {
            flex-wrap: wrap;
            gap: 8px;
        }

        @media (max-width: 640px) {
            .fc .fc-toolbar {
                gap: 4px;
            }
            
            .fc .fc-toolbar > * {
                margin: 0 !important;
            }
        }

        .fc-event {
            cursor: pointer;
            font-size: 0.85em;
        }

        @media (max-width: 640px) {
            .fc-event {
                font-size: 0.75em;
            }
        }

        .fc-event-draggable {
            cursor: grab !important;
        }
        .fc-event-draggable:active {
            cursor: grabbing !important;
        }

        .fc-col-header-cell-cushion {
            color: #000000 !important;
            font-weight: 600 !important;
            font-size: 0.9em;
        }

        @media (max-width: 640px) {
            .fc-col-header-cell-cushion {
                font-size: 0.75em;
            }
        }

        .fc-daygrid-day-number,
        .fc-timegrid-slot-label-cushion {
            color: #000000 !important;
            font-weight: 500 !important;
            font-size: 0.85em;
        }

        @media (max-width: 640px) {
            .fc-daygrid-day-number,
            .fc-timegrid-slot-label-cushion {
                font-size: 0.7em;
            }
        }

        .fc-daygrid-day-top {
            color: #000000 !important;
        }

        .fc .fc-timegrid-axis-cushion {
            color: #000000 !important;
        }

        .fc-day-today {
            background-color: rgba(5, 81, 171, 0.1) !important;
        }

        @media (max-width: 640px) {
            .fc .fc-timegrid-slot {
                height: 2em !important;
            }
        }
    `;

    return <style dangerouslySetInnerHTML={{ __html: styles }} />;
}