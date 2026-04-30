package com.example.onboarding.dto;

import com.example.onboarding.entity.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {
    private Long id;
    private String name;
    private String documentType; // "MANDATORY" or "OPTIONAL"

    public static DocumentDTO fromDocument(Document doc) {
        if (doc == null) return null;
        return new DocumentDTO(
                doc.getId(),
                doc.getName(),
                doc.getDocumentType().toString()
        );
    }
}

