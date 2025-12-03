import facebookFields from './facebook_fields.json';

export type FieldType = 'facebook_page_insights' | 'facebook_page_posts_insights' | 'facebook_post_metadata';

interface FacebookField {
  title: string;
  description: string;
  periods?: string[];
}

interface FacebookFieldsConfig {
  facebook_page_insights: FacebookField[];
  facebook_page_posts_insights: FacebookField[];
  facebook_post_metadata: FacebookField[];
}

class FacebookFieldsHelper {
  private fields: FacebookFieldsConfig;

  constructor() {
    this.fields = facebookFields as FacebookFieldsConfig;
  }

  /**
   * Get all field names for a specific field type
   * @param fieldType - The type of fields to retrieve
   * @param period - Optional: Filter fields by allowed period
   * @returns Array of field names
   */
  getFieldNames(fieldType: FieldType, period?: string): string[] {
    const fieldsArray = this.fields[fieldType];
    
    if (!fieldsArray) {
      throw new Error(`Invalid field type: ${fieldType}`);
    }

    // If period is specified, filter fields that support that period
    if (period) {
      return fieldsArray
        .filter(field => !field.periods || field.periods.length === 0 || field.periods.includes(period))
        .map(field => field.title);
    }

    // Return all field names
    return fieldsArray.map(field => field.title);
  }

  /**
   * Get fields that support a specific period
   * @param fieldType - The type of fields to retrieve
   * @param period - The period to filter by (day, week, days_28, lifetime, etc)
   * @returns Array of field names that support the specified period
   */
  getFieldsByPeriod(fieldType: FieldType, period: string): string[] {
    const fieldsArray = this.fields[fieldType];
    
    return fieldsArray
      .filter(field => !field.periods || field.periods.length === 0 || field.periods.includes(period))
      .map(field => field.title);
  }

  /**
   * Get full field details for a specific field type
   * @param fieldType - The type of fields to retrieve
   * @returns Array of field objects with title, description, and periods
   */
  getFieldDetails(fieldType: FieldType): FacebookField[] {
    return this.fields[fieldType];
  }

  /**
   * Validate if a period is valid for a specific field
   * @param fieldType - The type of field
   * @param fieldName - The field name
   * @param period - The period to validate
   * @returns boolean indicating if the period is valid
   */
  isPeriodValidForField(fieldType: FieldType, fieldName: string, period: string): boolean {
    const fieldsArray = this.fields[fieldType];
    const field = fieldsArray.find(f => f.title === fieldName);
    
    if (!field) {
      throw new Error(`Field not found: ${fieldName}`);
    }

    // No periods property or empty periods array means no period restriction
    if (!field.periods || field.periods.length === 0) {
      return true;
    }

    return field.periods.includes(period);
  }

  /**
   * Chunk fields into batches (Facebook has limits on fields per request)
   * @param fields - Array of field names
   * @param batchSize - Maximum fields per batch (default 50)
   * @returns Array of field batches
   */
  chunkFields(fields: string[], batchSize: number = 50): string[][] {
    const chunks: string[][] = [];
    for (let i = 0; i < fields.length; i += batchSize) {
      chunks.push(fields.slice(i, i + batchSize));
    }
    return chunks;
  }

  /**
   * Get fields that have no period restrictions
   * @param fieldType - The type of fields to retrieve
   * @returns Array of field names with no period restrictions
   */
  getFieldsWithoutPeriods(fieldType: FieldType): string[] {
    const fieldsArray = this.fields[fieldType];
    
    return fieldsArray
      .filter(field => !field.periods || field.periods.length === 0)
      .map(field => field.title);
  }

  /**
   * Get all available periods for a field type
   * @param fieldType - The type of fields to retrieve
   * @returns Array of unique period values
   */
  getAvailablePeriods(fieldType: FieldType): string[] {
    const fieldsArray = this.fields[fieldType];
    const periods = new Set<string>();
    
    fieldsArray.forEach(field => {
      if (field.periods && field.periods.length > 0) {
        field.periods.forEach(period => periods.add(period));
      }
    });
    
    return Array.from(periods);
  }
}

// Create singleton instance
const facebookFieldsHelper = new FacebookFieldsHelper();

export { FacebookFieldsHelper, facebookFieldsHelper };