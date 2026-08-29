# Templates

Ten templates ship in `src/data/templates.ts`. Open **Templates** from the toolbar or command palette (`Cmd/Ctrl+P` → Open Templates).

| Template               | Category    | Size      |
| ---------------------- | ----------- | --------- |
| Minimal Event Poster   | Minimal     | 1080×1350 |
| Corporate Announcement | Corporate   | 1080×1350 |
| Social Media Post      | Social      | 1080×1080 |
| Business Infographic   | Infographic | 1200×1500 |
| Data Dashboard Poster  | Data        | 1920×1080 |
| Quote Poster           | Quote       | 1080×1350 |
| Product Promotion      | Product     | 1080×1350 |
| Educational Poster     | Education   | 1080×1350 |
| Financial Report       | Finance     | 1200×1500 |
| Cambodia-themed poster | Regional    | 1080×1350 |

Loading a template replaces the editor buffer. If you have unsaved changes, a confirmation dialog appears.

To add a template, append to the `TEMPLATES` array in `src/data/templates.ts` with `id`, `name`, `category`, `description`, `width`, `height`, and `code`.
