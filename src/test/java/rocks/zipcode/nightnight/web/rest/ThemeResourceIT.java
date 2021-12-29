package rocks.zipcode.nightnight.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import rocks.zipcode.nightnight.IntegrationTest;
import rocks.zipcode.nightnight.domain.Theme;
import rocks.zipcode.nightnight.repository.ThemeRepository;

/**
 * Integration tests for the {@link ThemeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ThemeResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_LINK = "AAAAAAAAAA";
    private static final String UPDATED_LINK = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/themes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ThemeRepository themeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restThemeMockMvc;

    private Theme theme;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Theme createEntity(EntityManager em) {
        Theme theme = new Theme().title(DEFAULT_TITLE).link(DEFAULT_LINK);
        return theme;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Theme createUpdatedEntity(EntityManager em) {
        Theme theme = new Theme().title(UPDATED_TITLE).link(UPDATED_LINK);
        return theme;
    }

    @BeforeEach
    public void initTest() {
        theme = createEntity(em);
    }

    @Test
    @Transactional
    void createTheme() throws Exception {
        int databaseSizeBeforeCreate = themeRepository.findAll().size();
        // Create the Theme
        restThemeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(theme)))
            .andExpect(status().isCreated());

        // Validate the Theme in the database
        List<Theme> themeList = themeRepository.findAll();
        assertThat(themeList).hasSize(databaseSizeBeforeCreate + 1);
        Theme testTheme = themeList.get(themeList.size() - 1);
        assertThat(testTheme.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testTheme.getLink()).isEqualTo(DEFAULT_LINK);
    }

    @Test
    @Transactional
    void createThemeWithExistingId() throws Exception {
        // Create the Theme with an existing ID
        theme.setId(1L);

        int databaseSizeBeforeCreate = themeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restThemeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(theme)))
            .andExpect(status().isBadRequest());

        // Validate the Theme in the database
        List<Theme> themeList = themeRepository.findAll();
        assertThat(themeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllThemes() throws Exception {
        // Initialize the database
        themeRepository.saveAndFlush(theme);

        // Get all the themeList
        restThemeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(theme.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].link").value(hasItem(DEFAULT_LINK)));
    }

    @Test
    @Transactional
    void getTheme() throws Exception {
        // Initialize the database
        themeRepository.saveAndFlush(theme);

        // Get the theme
        restThemeMockMvc
            .perform(get(ENTITY_API_URL_ID, theme.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(theme.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.link").value(DEFAULT_LINK));
    }

    @Test
    @Transactional
    void getNonExistingTheme() throws Exception {
        // Get the theme
        restThemeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTheme() throws Exception {
        // Initialize the database
        themeRepository.saveAndFlush(theme);

        int databaseSizeBeforeUpdate = themeRepository.findAll().size();

        // Update the theme
        Theme updatedTheme = themeRepository.findById(theme.getId()).get();
        // Disconnect from session so that the updates on updatedTheme are not directly saved in db
        em.detach(updatedTheme);
        updatedTheme.title(UPDATED_TITLE).link(UPDATED_LINK);

        restThemeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTheme.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTheme))
            )
            .andExpect(status().isOk());

        // Validate the Theme in the database
        List<Theme> themeList = themeRepository.findAll();
        assertThat(themeList).hasSize(databaseSizeBeforeUpdate);
        Theme testTheme = themeList.get(themeList.size() - 1);
        assertThat(testTheme.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testTheme.getLink()).isEqualTo(UPDATED_LINK);
    }

    @Test
    @Transactional
    void putNonExistingTheme() throws Exception {
        int databaseSizeBeforeUpdate = themeRepository.findAll().size();
        theme.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restThemeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, theme.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(theme))
            )
            .andExpect(status().isBadRequest());

        // Validate the Theme in the database
        List<Theme> themeList = themeRepository.findAll();
        assertThat(themeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTheme() throws Exception {
        int databaseSizeBeforeUpdate = themeRepository.findAll().size();
        theme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restThemeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(theme))
            )
            .andExpect(status().isBadRequest());

        // Validate the Theme in the database
        List<Theme> themeList = themeRepository.findAll();
        assertThat(themeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTheme() throws Exception {
        int databaseSizeBeforeUpdate = themeRepository.findAll().size();
        theme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restThemeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(theme)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Theme in the database
        List<Theme> themeList = themeRepository.findAll();
        assertThat(themeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateThemeWithPatch() throws Exception {
        // Initialize the database
        themeRepository.saveAndFlush(theme);

        int databaseSizeBeforeUpdate = themeRepository.findAll().size();

        // Update the theme using partial update
        Theme partialUpdatedTheme = new Theme();
        partialUpdatedTheme.setId(theme.getId());

        partialUpdatedTheme.link(UPDATED_LINK);

        restThemeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTheme.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTheme))
            )
            .andExpect(status().isOk());

        // Validate the Theme in the database
        List<Theme> themeList = themeRepository.findAll();
        assertThat(themeList).hasSize(databaseSizeBeforeUpdate);
        Theme testTheme = themeList.get(themeList.size() - 1);
        assertThat(testTheme.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testTheme.getLink()).isEqualTo(UPDATED_LINK);
    }

    @Test
    @Transactional
    void fullUpdateThemeWithPatch() throws Exception {
        // Initialize the database
        themeRepository.saveAndFlush(theme);

        int databaseSizeBeforeUpdate = themeRepository.findAll().size();

        // Update the theme using partial update
        Theme partialUpdatedTheme = new Theme();
        partialUpdatedTheme.setId(theme.getId());

        partialUpdatedTheme.title(UPDATED_TITLE).link(UPDATED_LINK);

        restThemeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTheme.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTheme))
            )
            .andExpect(status().isOk());

        // Validate the Theme in the database
        List<Theme> themeList = themeRepository.findAll();
        assertThat(themeList).hasSize(databaseSizeBeforeUpdate);
        Theme testTheme = themeList.get(themeList.size() - 1);
        assertThat(testTheme.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testTheme.getLink()).isEqualTo(UPDATED_LINK);
    }

    @Test
    @Transactional
    void patchNonExistingTheme() throws Exception {
        int databaseSizeBeforeUpdate = themeRepository.findAll().size();
        theme.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restThemeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, theme.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(theme))
            )
            .andExpect(status().isBadRequest());

        // Validate the Theme in the database
        List<Theme> themeList = themeRepository.findAll();
        assertThat(themeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTheme() throws Exception {
        int databaseSizeBeforeUpdate = themeRepository.findAll().size();
        theme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restThemeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(theme))
            )
            .andExpect(status().isBadRequest());

        // Validate the Theme in the database
        List<Theme> themeList = themeRepository.findAll();
        assertThat(themeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTheme() throws Exception {
        int databaseSizeBeforeUpdate = themeRepository.findAll().size();
        theme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restThemeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(theme)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Theme in the database
        List<Theme> themeList = themeRepository.findAll();
        assertThat(themeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTheme() throws Exception {
        // Initialize the database
        themeRepository.saveAndFlush(theme);

        int databaseSizeBeforeDelete = themeRepository.findAll().size();

        // Delete the theme
        restThemeMockMvc
            .perform(delete(ENTITY_API_URL_ID, theme.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Theme> themeList = themeRepository.findAll();
        assertThat(themeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
