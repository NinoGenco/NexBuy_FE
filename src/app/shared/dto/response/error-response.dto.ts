export interface ErrorResponseDto {
  timestamp: string;       // ISO string (es. "2025-07-21T14:35:00")
  status: number;          // Codice HTTP (es. 400, 404, 500)
  error: string;           // Tipo errore (es. "Bad Request", "Internal Server Error")
  message: string;         // Descrizione dettagliata (es. "Invalid ID")
  path: string;            // Endpoint chiamato (es. "/api/sensors/42")
}
