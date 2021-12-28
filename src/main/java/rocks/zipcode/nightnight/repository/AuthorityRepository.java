package rocks.zipcode.nightnight.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rocks.zipcode.nightnight.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
