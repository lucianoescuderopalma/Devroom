package com.devroom.backend.repository;

import com.devroom.backend.entity.RepositoryEntity;
import com.devroom.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface RepositoryEntityRepository extends JpaRepository<RepositoryEntity, String> {
    List<RepositoryEntity> findByUser(User user);
    @Transactional
    void deleteByUser(User user);
}
