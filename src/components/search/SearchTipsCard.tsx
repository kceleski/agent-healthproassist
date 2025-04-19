
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const SearchTipsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-1">
          <li>Be specific with location (city, state, or zip code)</li>
          <li>Select a care type to narrow down results</li>
          <li>Choose amenities that are important to your client</li>
          <li>Results will be shown on an interactive map</li>
          <li>You can save facilities to your favorites list for future reference</li>
        </ul>
      </CardContent>
    </Card>
  );
};
