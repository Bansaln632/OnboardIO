package com.example.onboarding.repository;

import com.example.onboarding.entity.Document;
import com.example.onboarding.entity.User;
import com.example.onboarding.entity.UserDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDocumentRepository extends JpaRepository<UserDocument, Long> {

    /**
     * Find all documents uploaded by a specific user
     */
    List<UserDocument> findByUser(User user);

    /**
     * Find a specific document for a user
     */
    Optional<UserDocument> findByUserAndDocument(User user, Document document);

    /**
     * Find all pending documents for a user (not yet uploaded)
     */
    List<UserDocument> findByUserAndStatus(User user, UserDocument.UploadStatus status);

    /**
     * Find all uploaded documents for a user
     */
    List<UserDocument> findByUserAndStatusIn(User user, List<UserDocument.UploadStatus> statuses);

    /**
     * Count MANDATORY documents assigned to a user (for progress calculation)
     */
    @Query("SELECT COUNT(ud) FROM UserDocument ud WHERE ud.user.id = :userId " +
           "AND ud.document.documentType = 'MANDATORY'")
    long countMandatoryDocumentsByUserId(Long userId);

    /**
     * Count APPROVED MANDATORY documents for a user (for progress calculation)
     */
    @Query("SELECT COUNT(ud) FROM UserDocument ud WHERE ud.user.id = :userId " +
           "AND ud.document.documentType = 'MANDATORY' " +
           "AND ud.approvalStatus = 'APPROVED'")
    long countApprovedMandatoryDocumentsByUserId(Long userId);
}

